// src/models/Route.model.js
import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, trim: true },           // e.g. "11", "17A", "C1"
    sourceStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    destinationStation: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    distanceKm: { type: Number, required: true, min: 0 },
    stops: { type: Number, required: true, min: 0 },
    estimatedTimeMinutes: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);
export default Route;
