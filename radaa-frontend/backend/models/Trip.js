import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    matatu: { type: mongoose.Schema.Types.ObjectId, ref: "Matatu", required: true },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled"],
      default: "ongoing"
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    startLocation: { type: pointSchema },
    endLocation: { type: pointSchema },
    fare: { type: Number },
    currency: { type: String, default: "KES" }
  },
  {
    timestamps: true
  }
);

tripSchema.index({ startLocation: "2dsphere" });
tripSchema.index({ endLocation: "2dsphere" });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
