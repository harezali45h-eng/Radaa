import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  aliases: { type: [String], default: [] },
  polyline: {
    type: {
      type: String,
      enum: ["LineString"],
      default: "LineString"
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

routeSchema.index({ polyline: "2dsphere" });
routeSchema.index({ name: 1 });
routeSchema.index({ aliases: 1 });

const Route = mongoose.model("Route", routeSchema);

export default Route;
