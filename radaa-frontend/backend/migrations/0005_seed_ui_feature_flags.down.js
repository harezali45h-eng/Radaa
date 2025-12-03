export const down = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for UI feature flags migration down");
  }

  const collectionName = "feature_flags";

  const existingCollections = await db.listCollections({ name: collectionName }).toArray();
  if (existingCollections.length === 0) {
    return;
  }

  const collection = db.collection(collectionName);

  const keys = [
    "ui_revamp_v1",
    "map_photos_v1",
    "trip_ui_v1",
    "driver_onboard_v1",
    "sacco_onboard_v1"
  ];

  await collection.deleteMany({ key: { $in: keys } });
};
