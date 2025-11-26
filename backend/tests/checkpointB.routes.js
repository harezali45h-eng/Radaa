import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "../models/Route.js";
import Matatu from "../models/Matatu.js";
import { searchRoutes, getMatatusOnRoute } from "../controllers/routesController.js";
import { up as up0001 } from "../migrations/0001_create_feature_flags.up.js";
import { up as up0002 } from "../migrations/0002_create_routes.up.js";

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

const runRouteSearchTest = async (route) => {
  const req = {
    query: {
      q: "thika"
    }
  };

  const { res, response } = createMockRes();

  let nextError = null;
  const next = (err) => {
    nextError = err;
  };

  await searchRoutes(req, res, next);

  if (nextError) {
    throw nextError;
  }

  if (response.statusCode !== 200) {
    throw new Error(`searchRoutes expected status 200, got ${response.statusCode}`);
  }

  if (!response.body || response.body.success !== true || !Array.isArray(response.body.data)) {
    throw new Error("searchRoutes returned invalid payload");
  }

  const found = response.body.data.some((r) => {
    return (
      r &&
      (r._id?.toString?.() === route._id.toString() ||
        String(r._id) === route._id.toString())
    );
  });

  if (!found) {
    throw new Error("searchRoutes did not return the created route for fuzzy query");
  }
};

const runMatatusOnRouteTest = async (route) => {
  await Matatu.collection.createIndex({ lastLocation: "2dsphere" });

  const [baseLng, baseLat] = route.polyline.coordinates[0];

  const now = Date.now();

  const matatu1 = await Matatu.create({
    plate: `CPB-${now}-1`,
    route: route.name,
    lastLocation: {
      type: "Point",
      coordinates: [baseLng, baseLat]
    },
    location: {
      lat: baseLat,
      lng: baseLng
    },
    isOnline: true
  });

  const matatu2 = await Matatu.create({
    plate: `CPB-${now}-2`,
    route: route.name,
    lastLocation: {
      type: "Point",
      coordinates: [baseLng + 0.0008, baseLat + 0.0008]
    },
    location: {
      lat: baseLat + 0.0008,
      lng: baseLng + 0.0008
    },
    isOnline: true
  });

  const req = {
    params: {
      id: route._id.toString()
    },
    query: {
      radius: "300"
    }
  };

  const { res, response } = createMockRes();

  let nextError = null;
  const next = (err) => {
    nextError = err;
  };

  await getMatatusOnRoute(req, res, next);

  if (nextError) {
    throw nextError;
  }

  if (response.statusCode !== 200) {
    throw new Error(`getMatatusOnRoute expected status 200, got ${response.statusCode}`);
  }

  if (!response.body || response.body.success !== true || !Array.isArray(response.body.data)) {
    throw new Error("getMatatusOnRoute returned invalid payload");
  }

  const ids = response.body.data.map((m) => m && m._id && m._id.toString());

  if (!ids.includes(matatu1._id.toString()) || !ids.includes(matatu2._id.toString())) {
    throw new Error("getMatatusOnRoute did not return both nearby matatus");
  }
};

const run = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGO_URI or MONGODB_URI must be set for Checkpoint B tests");
  }

  await mongoose.connect(uri);

  const db = mongoose.connection.db;

  await up0001(mongoose);
  await up0002(mongoose);

  await Route.deleteMany({ tags: "checkpoint-b" });
  await Matatu.deleteMany({ plate: /CPB-/ });

  await db.collection("feature_flags").updateOne(
    { key: "ROUTES_V1" },
    {
      $set: {
        key: "ROUTES_V1",
        enabled: true,
        rollout_percent: 100,
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  const route = await Route.create({
    name: "Thika Super Highway",
    aliases: ["Thika Road", "Super Highway"],
    polyline: {
      type: "LineString",
      coordinates: [
        [36.8219, -1.2921],
        [36.825, -1.295],
        [36.828, -1.3]
      ]
    },
    tags: ["checkpoint-b", "test"]
  });

  await runRouteSearchTest(route);
  await runMatatusOnRouteTest(route);

  // eslint-disable-next-line no-console
  console.log("Checkpoint B routes tests passed");
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
