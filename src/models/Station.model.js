// src/models/Station.model.js
import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    stationCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    stationName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    zone: { type: String, trim: true },                  // e.g. "Central", "East", "West"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);
export default Station;
