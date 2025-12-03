export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for ratings/photos migration up");
  }

  const ratingsCollectionName = "ratings";

  const existingRatings = await db
    .listCollections({ name: ratingsCollectionName })
    .toArray();

  if (existingRatings.length === 0) {
    await db.createCollection(ratingsCollectionName);
  }

  const ratings = db.collection(ratingsCollectionName);

  await ratings.createIndex({ matatuId: 1, createdAt: -1 });
  await ratings.createIndex({ driverId: 1, createdAt: -1 });
  await ratings.createIndex({ userId: 1, createdAt: -1 });

  const matatusCollectionName = "matatus";
  const existingMatatus = await db
    .listCollections({ name: matatusCollectionName })
    .toArray();

  if (existingMatatus.length > 0) {
    await db.collection(matatusCollectionName).updateMany(
      { photos: { $exists: false } },
      {
        $set: {
          photos: []
        }
      }
    );
  }
};
