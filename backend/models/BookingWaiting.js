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
      required: true
    }
  },
  { _id: false }
);

const bookingWaitingSchema = new mongoose.Schema({
  requestId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  pickupLocation: { type: pointSchema, required: true },
  locked: { type: Boolean, default: false },
  autoCancelReason: { type: String, default: null },
  autoCancelAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

bookingWaitingSchema.index({ pickupLocation: "2dsphere" });

const BookingWaiting = mongoose.model("BookingWaiting", bookingWaitingSchema);

export default BookingWaiting;
