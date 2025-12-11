import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Matatu from "../models/Matatu.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const httpRequest = (method, path, body) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const data = body ? JSON.stringify(body) : null;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data ? Buffer.byteLength(data) : 0
      }
    };

    const req = http.request(options, (res) => {
      let raw = "";

      res.on("data", (chunk) => {
        raw += chunk;
      });

      res.on("end", () => {
        let json = null;
        if (raw) {
          try {
            json = JSON.parse(raw);
          } catch {
            json = null;
          }
        }
        resolve({ status: res.statusCode, body: json });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const healthRes = await httpRequest("GET", "/api/health");

  if (!healthRes.body || healthRes.body.status !== "ok" || healthRes.body.db !== "connected") {
    throw new Error("Health check failed");
  }

  const uniqueSuffix = Date.now().toString();

  const user = await User.create({
    username: `test-user-${uniqueSuffix}`,
    email: `test-${uniqueSuffix}@example.com`,
    phone: "0700000000",
    password: "Password123!"
  });

  const matatu = await Matatu.create({
    plate: `KAA${uniqueSuffix.slice(-3)}`,
    route: "Test Route",
    driverName: "Test Driver",
    driverPhone: "0712345678"
  });

  const locRes = await httpRequest("POST", `/api/matatus/${matatu._id}/location`, {
    lat: -1.2921,
    lng: 36.8219
  });

  if (!locRes.body || !locRes.body.ok) {
    throw new Error("Matatu location update failed");
  }

  const updatedMatatu = await Matatu.findById(matatu._id);

  if (
    !updatedMatatu ||
    !updatedMatatu.lastLocation ||
    !Array.isArray(updatedMatatu.lastLocation.coordinates) ||
    updatedMatatu.lastLocation.coordinates.length !== 2
  ) {
    throw new Error("Matatu location not updated in DB");
  }

  for (let i = 0; i < 10; i += 1) {
    const payRes = await httpRequest("POST", "/api/payments/ride", {
      userId: user._id.toString(),
      matatuId: matatu._id.toString(),
      amount: 100,
      currency: "KES",
      provider: "test-provider",
      providerPaymentId: `PAY-${uniqueSuffix}-${i}`,
      status: "success"
    });

    if (payRes.status !== 201) {
      throw new Error("Ride payment request failed");
    }

    if (i === 9) {
      if (!payRes.body || !payRes.body.loyalty || payRes.body.loyalty.freeRides < 1) {
        throw new Error("Free ride not granted on 10th ride");
      }
    }
  }

  const beforeRedeemUser = await User.findById(user._id);
  const freeRidesBefore = beforeRedeemUser.loyalty ? beforeRedeemUser.loyalty.freeRides : 0;

  const redeemRes = await httpRequest("POST", "/api/payments/redeem-free", {
    userId: user._id.toString(),
    matatuId: matatu._id.toString(),
    provider: "test-provider"
  });

  if (redeemRes.status !== 201) {
    throw new Error("Redeem free ride failed");
  }

  const afterRedeemUser = await User.findById(user._id);
  const freeRidesAfter = afterRedeemUser.loyalty ? afterRedeemUser.loyalty.freeRides : 0;

  if (freeRidesAfter !== freeRidesBefore - 1) {
    throw new Error("Free rides not decremented after redeem");
  }

  console.log("Integration tests passed");
};

run()
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    mongoose
      .disconnect()
      .catch(() => {})
      .finally(() => {
        process.exit(1);
      });
  });
