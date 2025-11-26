import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  requestId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: { type: String },
  autoCancelAt: { type: Date },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

auditLogSchema.index({ type: 1 });

auditLogSchema.index({ requestId: 1 });

auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
