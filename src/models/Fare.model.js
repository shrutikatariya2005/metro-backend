// src/models/Fare.model.js
import mongoose from "mongoose";

const fareSchema = new mongoose.Schema(
  {
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true, unique: true },
    baseFare: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0 }, // percentage, e.g. 5 = 5%
  },
  { timestamps: true }
);

const Fare = mongoose.model("Fare", fareSchema);
export default Fare;
