export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error(
      "No active MongoDB connection for payment confirmations migration up",
    );
  }

  const collectionName = "paymentconfirmations";

  const existing = await db
    .listCollections({ name: collectionName })
    .toArray();
  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }

  const collection = db.collection(collectionName);

  await collection.createIndex({ user: 1, createdAt: -1 });
  await collection.createIndex({ payment: 1 }, { unique: true });
};
