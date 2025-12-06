import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "fare"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    balanceAfter: {
      type: Number
    },
    matatu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matatu",
      default: null
    },
    reference: {
      type: String
    },
    status: {
      type: String,
      default: "success"
    }
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    transactions: {
      type: [walletTransactionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
