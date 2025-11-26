export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for UI feature flags migration up");
  }

  const collectionName = "feature_flags";

  const existingCollections = await db.listCollections({ name: collectionName }).toArray();
  if (existingCollections.length === 0) {
    await db.createCollection(collectionName);
    await db.collection(collectionName).createIndex({ key: 1 }, { unique: true });
  }

  const collection = db.collection(collectionName);

  const now = new Date();
  const keys = [
    "ui_revamp_v1",
    "map_photos_v1",
    "trip_ui_v1",
    "driver_onboard_v1",
    "sacco_onboard_v1"
  ];

  const ops = keys.map((key) =>
    collection.updateOne(
      { key },
      {
        $setOnInsert: {
          key,
          enabled: false,
          rollout_percent: 0,
          createdAt: now
        }
      },
      { upsert: true }
    )
  );

  await Promise.all(ops);
};
