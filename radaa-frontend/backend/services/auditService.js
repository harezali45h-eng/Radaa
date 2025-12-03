import AuditLog from "../models/AuditLog.js";

export const logAutoCancel = async ({ requestId, userId, reason, autoCancelAt, meta }) => {
  try {
    await AuditLog.updateOne(
      { type: "AUTO_CANCEL", requestId },
      {
        $set: {
          type: "AUTO_CANCEL",
          requestId,
          userId,
          reason,
          autoCancelAt: autoCancelAt || new Date(),
          meta: meta || {}
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
  } catch (error) {
    // Best-effort logging only; do not throw from here.
  }
};
