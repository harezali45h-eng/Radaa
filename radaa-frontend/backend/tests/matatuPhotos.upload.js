import mongoose from "mongoose";
import dotenv from "dotenv";
import Matatu from "../models/Matatu.js";
import { uploadMatatuPhoto } from "../controllers/matatuMediaController.js";
import { up as up0001 } from "../migrations/0001_create_feature_flags.up.js";

dotenv.config();

const createMockRes = () => {
  const response = {
    statusCode: 200,
    body: null
  };

  const res = {
    status(code) {
      response.statusCode = code;
      return this;
    },
    json(payload) {
      response.body = payload;
      return this;
    }
  };

  return { res, response };
};

const run = async () => {
  const envUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const uri = envUri || "mongodb://localhost:27017/radaa";

  try {
    await mongoose.connect(uri);
  } catch (err) {
    const message = (err && err.message) || String(err || "");
    if (err?.name === "MongooseServerSelectionError" && message.includes("ECONNREFUSED")) {
      // eslint-disable-next-line no-console
      console.warn(
        "[matatuPhotos.upload] MongoDB is not reachable at",
        uri,
        "- skipping matatu photos upload test. Start MongoDB to run this test fully."
      );
      return;
    }

    throw err;
  }

  const db = mongoose.connection.db;

  await up0001(mongoose);

  await db.collection("feature_flags").updateOne(
    { key: "matatu_photos_v1" },
    {
      $set: {
        key: "matatu_photos_v1",
        enabled: true,
        rollout_percent: 100,
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  await Matatu.deleteMany({ plate: /CPU-/ });

  const matatu = await Matatu.create({
    plate: `CPU-${Date.now()}`,
    route: "Upload Test Route"
  });

  const req = {
    user: { _id: new mongoose.Types.ObjectId(), role: "driver" },
    params: { id: matatu._id.toString() },
    body: { caption: "Test photo" },
    file: {
      mimetype: "image/jpeg",
      size: 1024,
      filename: `test-${Date.now()}.jpg`
    }
  };

  const { res, response } = createMockRes();

  let nextError = null;
  const next = (err) => {
    nextError = err;
  };

  await uploadMatatuPhoto(req, res, next);

  if (nextError) {
    throw nextError;
  }

  if (response.statusCode !== 201) {
    throw new Error(
      `uploadMatatuPhoto expected status 201, got ${response.statusCode}`
    );
  }

  if (!response.body || response.body.success !== true || !response.body.data) {
    throw new Error("uploadMatatuPhoto returned invalid payload");
  }

  const data = response.body.data;

  if (data.mode !== "local") {
    throw new Error(`uploadMatatuPhoto expected mode 'local', got '${data.mode}'`);
  }

  if (!data.url || typeof data.url !== "string" || !data.url.startsWith("/uploads/")) {
    throw new Error("uploadMatatuPhoto returned invalid url for local mode");
  }

  const updatedMatatu = await Matatu.findById(matatu._id).lean();

  if (!updatedMatatu || !Array.isArray(updatedMatatu.photos) || updatedMatatu.photos.length === 0) {
    throw new Error("Matatu document was not updated with photo");
  }

  // eslint-disable-next-line no-console
  console.log("Matatu photos upload test passed");
};

run()
  .then(() => mongoose.disconnect())
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    mongoose
      .disconnect()
      .catch(() => {})
      .finally(() => {
        process.exit(1);
      });
  });
