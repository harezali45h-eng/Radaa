export const down = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for ratings/photos migration down");
  }

  const ratingsCollectionName = "ratings";

  const existingRatings = await db
    .listCollections({ name: ratingsCollectionName })
    .toArray();

  if (existingRatings.length > 0) {
    await db.dropCollection(ratingsCollectionName);
  }

  const matatusCollectionName = "matatus";
  const existingMatatus = await db
    .listCollections({ name: matatusCollectionName })
    .toArray();

  if (existingMatatus.length > 0) {
    await db.collection(matatusCollectionName).updateMany(
      {},
      {
        $unset: {
          photos: ""
        }
      }
    );
  }
};
