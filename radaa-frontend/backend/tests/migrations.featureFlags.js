import mongoose from "mongoose";
import dotenv from "dotenv";
import { up as up0001 } from "../migrations/0001_create_feature_flags.up.js";
import { down as down0001 } from "../migrations/0001_create_feature_flags.down.js";

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGO_URI or MONGODB_URI must be set for migrations test");
  }

  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const collectionName = "feature_flags";

  const existingBefore = await db.listCollections({ name: collectionName }).toArray();
  if (existingBefore.length > 0) {
    await db.dropCollection(collectionName);
  }

  await up0001(mongoose);

  const afterUp = await db.listCollections({ name: collectionName }).toArray();
  if (afterUp.length === 0) {
    throw new Error("feature_flags collection was not created by up migration");
  }

  await down0001(mongoose);

  const afterDown = await db.listCollections({ name: collectionName }).toArray();
  if (afterDown.length !== 0) {
    throw new Error("feature_flags collection was not dropped by down migration");
  }

  // eslint-disable-next-line no-console
  console.log("Checkpoint A migrations test passed");
};

run()
  .then(() => {
    return mongoose.disconnect();
  })
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
