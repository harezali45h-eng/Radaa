import mongoose from "mongoose";

const paymentConfirmationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RidePayment",
    required: true,
    unique: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "KES" },
  purpose: { type: String },
  channel: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  seenAt: { type: Date },
  meta: { type: Object }
});

paymentConfirmationSchema.index({ user: 1, createdAt: -1 });

paymentConfirmationSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

const PaymentConfirmation = mongoose.model(
  "PaymentConfirmation",
  paymentConfirmationSchema
);

export default PaymentConfirmation;
