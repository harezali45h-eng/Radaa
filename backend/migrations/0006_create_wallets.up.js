export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for wallets migration up");
  }

  const collectionName = "wallets";

  const existing = await db.listCollections({ name: collectionName }).toArray();
  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }

  const collection = db.collection(collectionName);

  await collection.createIndex({ user: 1 }, { unique: true });
};
