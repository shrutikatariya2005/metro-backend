// src/models/Payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "card", "upi", "wallet"], default: "cash" },
    status: { type: String, enum: ["pending", "completed", "refunded"], default: "completed" },
    transactionId: { type: String, trim: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
