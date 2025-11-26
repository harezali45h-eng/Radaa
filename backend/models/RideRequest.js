import mongoose from "mongoose";

const { Schema } = mongoose;

const rideRequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    matatu: {
      type: Schema.Types.ObjectId,
      ref: "Matatu",
      default: null
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "ongoing", "completed", "cancelled"],
      default: "pending"
    },
    pickup: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    destination: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: undefined
      }
    },
    fareEstimate: {
      type: Number,
      default: 0
    },
    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    hits: {
      type: Number,
      default: 0
    },
    saccoId: {
      type: Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

rideRequestSchema.index({ pickup: "2dsphere" });

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

export default RideRequest;
