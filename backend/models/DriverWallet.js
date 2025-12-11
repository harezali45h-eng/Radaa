import mongoose from "mongoose";

const driverWalletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "withdrawal", "adjustment"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    reference: {
      type: String
    },
    meta: {
      type: Object
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const driverWalletWithdrawalSchema = new mongoose.Schema(
  {
    amountRequested: {
      type: Number,
      required: true
    },
    platformCut: {
      type: Number,
      required: true
    },
    driverShare: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "failed"],
      default: "pending"
    },
    isManualPayout: {
      type: Boolean,
      default: true
    },
    mpesaReceiptNumber: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    failureReason: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const driverWalletSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    walletBalance: {
      type: Number,
      default: 0
    },
    pendingWithdrawals: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    currency: {
      type: String,
      default: "KES"
    },
    transactions: {
      type: [driverWalletTransactionSchema],
      default: []
    },
    withdrawals: {
      type: [driverWalletWithdrawalSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

driverWalletSchema.pre("save", function nextHook(next) {
  this.lastUpdated = new Date();
  next();
});

const DriverWallet = mongoose.model("DriverWallet", driverWalletSchema);

export default DriverWallet;
