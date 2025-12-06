import mongoose from "mongoose";

const ridePaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matatu: { type: mongoose.Schema.Types.ObjectId, ref: "Matatu" },
  amount: { type: Number, required: true },
  currency: { type: String, default: "KES" },
  provider: { type: String, required: true },
  providerPaymentId: { type: String, required: true },
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now },
  method: { type: String },
  transactionId: { type: String },
  timestamp: { type: Date, default: Date.now },
  purpose: { type: String, default: "other" },
  walletApplied: { type: Boolean, default: false },
  idempotencyKey: { type: String },
  settlementBatchId: { type: mongoose.Schema.Types.ObjectId, ref: "PayoutBatch" }
});

ridePaymentSchema.index(
  { user: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $exists: true, $ne: null } }
  }
);

const RidePayment = mongoose.model("RidePayment", ridePaymentSchema);

export default RidePayment;
