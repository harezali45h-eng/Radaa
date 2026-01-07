import mongoose from "mongoose";

const matatuSchema = new mongoose.Schema({
  plate: { type: String, required: true, unique: true, trim: true },
  route: { type: String, required: true },
  driverName: { type: String },
  driverPhone: { type: String },
  lastLocation: {
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
  status: { type: String, default: "active" },
  updatedAt: { type: Date, default: Date.now },
  numberPlate: { type: String, trim: true },
  sacco: { type: String },
  driver: { type: String },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  photos: [
    {
      url: { type: String, required: true },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      source: { type: String },
      category: {
        type: String,
        enum: ["exterior", "interior", "cleanliness", "style", "crowd"],
        default: "exterior"
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },
      uploadedAt: { type: Date, default: Date.now },
      observedAt: { type: Date, default: Date.now },
      caption: { type: String },
      rejectionReason: { type: String }
    }
  ],
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  speed: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  driverStatus: {
    type: String,
    enum: ["provisional", "active", "suspended"],
    default: "provisional"
  },
  unverifiedMedia: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: true
  }
});

matatuSchema.index({ lastLocation: "2dsphere" });

const Matatu = mongoose.model("Matatu", matatuSchema);

export default Matatu;
