import mongoose from "mongoose";

const ridePaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matatu: { type: mongoose.Schema.Types.ObjectId, ref: "Matatu" },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  currency: { type: String, default: "KES" },
  provider: { type: String, required: true },
  providerPaymentId: { type: String, required: true },
  status: { type: String, default: "success" },
  fareAmount: { type: Number },
  serviceFee: { type: Number },
  totalPaid: { type: Number },
  platformCut: { type: Number },
  driverShare: { type: Number },
  mpesaReceiptNumber: { type: String },
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
