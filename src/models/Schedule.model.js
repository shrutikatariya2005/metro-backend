// src/models/Schedule.model.js
import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    departureTime: { type: String, required: true }, // "HH:mm"
    arrivalTime: { type: String, required: true },   // "HH:mm"
    daysOfWeek: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
