import mongoose from "mongoose";

const ridePaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matatu: { type: mongoose.Schema.Types.ObjectId, ref: "Matatu", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "KES" },
  provider: { type: String, required: true },
  providerPaymentId: { type: String, required: true },
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now },
  method: { type: String },
  transactionId: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const RidePayment = mongoose.model("RidePayment", ridePaymentSchema);

export default RidePayment;
