import mongoose from "mongoose";

const { Schema } = mongoose;

const liveRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    stageId: {
      type: String,
      default: null,
      index: true
    },
    corridorId: {
      type: String,
      default: null,
      index: true
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    status: {
      type: String,
      enum: ["waiting", "matched", "cancelled"],
      default: "waiting",
      index: true
    }
  },
  {
    timestamps: true
  }
);

liveRequestSchema.index({ userId: 1, status: 1 });
liveRequestSchema.index({ stageId: 1, status: 1 });
liveRequestSchema.index({ corridorId: 1, status: 1 });

const LiveRequest = mongoose.model("LiveRequest", liveRequestSchema);

export default LiveRequest;
