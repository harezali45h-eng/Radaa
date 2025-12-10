import mongoose from "mongoose";

const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    pickup: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destination: {
      lat: { type: Number },
      lng: { type: Number },
    },
    fare: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["mpesa", "cash", "wallet"],
      default: "cash",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
        "failed",
        "timeout",
      ],
      default: "pending",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    policy: {
      type: String,
      default: "FIRST_AVAILABLE",
      index: true,
    },
    meta: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index({ status: 1, createdAt: -1 });

const Request = mongoose.model("Request", requestSchema);

export default Request;
