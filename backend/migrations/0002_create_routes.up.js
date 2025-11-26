export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for routes migration up");
  }

  const collectionName = "routes";

  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }

  const collection = db.collection(collectionName);

  await collection.createIndex({ polyline: "2dsphere" });
  await collection.createIndex({ name: 1 });
  await collection.createIndex({ aliases: 1 });
};
