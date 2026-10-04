// src/models/Ticket.model.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketRef: { type: String, required: true, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    issuedAt: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "used", "cancelled", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
