export const down = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error(
      "No active MongoDB connection for payment confirmations migration down",
    );
  }

  const collectionName = "paymentconfirmations";

  const existing = await db
    .listCollections({ name: collectionName })
    .toArray();
  if (existing.length > 0) {
    await db.dropCollection(collectionName);
  }
};
