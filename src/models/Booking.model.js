// src/models/Booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
    passengerCount: { type: Number, required: true, min: 1 },
    fareAmount: { type: Number, required: true },
    travelDate: { type: String, required: true }, // "YYYY-MM-DD"
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "cancelled", "completed"],
      default: "pending_payment",
    },
    paymentId: { type: String },   // Razorpay payment ID after successful payment
    orderId: { type: String },     // Razorpay order ID
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
