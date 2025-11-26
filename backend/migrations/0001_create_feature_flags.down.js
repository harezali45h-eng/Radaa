export const down = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for feature_flags migration down");
  }

  const collectionName = "feature_flags";

  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length > 0) {
    await db.dropCollection(collectionName);
  }
};
