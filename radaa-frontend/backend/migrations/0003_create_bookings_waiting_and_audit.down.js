export const down = async (mongoose) => {
  const db = mongoose.connection?.db;
  if (!db) {
    throw new Error("No active MongoDB connection for bookings_waiting/audit_logs migration down");
  }

  const bookingsCollection = "bookings_waiting";
  const auditCollection = "audit_logs";

  const existingBookings = await db.listCollections({ name: bookingsCollection }).toArray();
  if (existingBookings.length > 0) {
    await db.dropCollection(bookingsCollection);
  }

  const existingAudit = await db.listCollections({ name: auditCollection }).toArray();
  if (existingAudit.length > 0) {
    await db.dropCollection(auditCollection);
  }
};
