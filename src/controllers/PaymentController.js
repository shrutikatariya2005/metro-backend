// src/controllers/PaymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import bookingRepository from "../repositories/BookingRepository.js";
import ticketService from "../services/TicketService.js";

/**
 * Get a Razorpay instance lazily — only after .env has been loaded.
 * Avoids crash on startup when keys are not yet set.
 */
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("REPLACE")) {
    throw new ApiError(503, "Payment gateway is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

class PaymentController {
  /**
   * Step 1: Create a Razorpay order for a pending booking.
   */
  createOrder = asyncHandler(async (req, res) => {
    const razorpay = getRazorpay();
    const { bookingId } = req.body;
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new ApiError(404, "Booking not found");

    const userId = booking.user?._id?.toString() || booking.user?.toString();
    if (userId !== req.user.id) throw new ApiError(403, "Not authorized to pay for this booking");

    if (booking.status === "confirmed") {
      throw new ApiError(400, "Booking is already paid and confirmed");
    }

    const amountInPaise = Math.round(booking.fareAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking.bookingRef,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
      },
    });

    res.status(200).json(
      new ApiResponse(200, {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingRef: booking.bookingRef,
        keyId: process.env.RAZORPAY_KEY_ID,
      })
    );
  });

  /**
   * Step 2: Verify Razorpay signature and confirm booking + issue ticket.
   */
  verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(400, "Payment verification failed. Invalid signature.");
    }

    const booking = await bookingRepository.updateById(bookingId, {
      status: "confirmed",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    if (!booking) throw new ApiError(404, "Booking not found");

    const ticket = await ticketService.issueTicket(bookingId);

    res.status(200).json(new ApiResponse(200, { booking, ticket }, "Payment successful! Booking confirmed."));
  });
}

export default new PaymentController();
