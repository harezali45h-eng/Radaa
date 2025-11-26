export const up = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for bookings_waiting/audit_logs migration up");
  }

  const bookingsCollection = "bookings_waiting";
  const auditCollection = "audit_logs";

  const existingBookings = await db.listCollections({ name: bookingsCollection }).toArray();
  if (existingBookings.length === 0) {
    await db.createCollection(bookingsCollection);
  }

  const bookings = db.collection(bookingsCollection);

  await bookings.createIndex({ requestId: 1 });
  await bookings.createIndex({ userId: 1 });
  await bookings.createIndex({ pickupLocation: "2dsphere" });

  const existingAudit = await db.listCollections({ name: auditCollection }).toArray();
  if (existingAudit.length === 0) {
    await db.createCollection(auditCollection);
  }

  const audit = db.collection(auditCollection);

  await audit.createIndex({ type: 1 });
  await audit.createIndex({ requestId: 1 });
  await audit.createIndex({ createdAt: -1 });
};
