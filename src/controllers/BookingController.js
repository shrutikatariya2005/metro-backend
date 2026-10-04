// src/controllers/BookingController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import bookingService from "../services/BookingService.js";

class BookingController {
  create = asyncHandler(async (req, res) => {
    const result = await bookingService.createBooking({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(new ApiResponse(201, result, "Booking confirmed"));
  });

  getMyHistory = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getBookingHistory(req.user.id);
    res.status(200).json(new ApiResponse(200, bookings));
  });

  getAll = asyncHandler(async (_req, res) => {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(new ApiResponse(200, bookings));
  });

  cancel = asyncHandler(async (req, res) => {
    const updated = await bookingService.cancelBooking(req.params.bookingRef, req.user.id);
    res.status(200).json(new ApiResponse(200, updated, "Booking cancelled"));
  });

  updateStatus = asyncHandler(async (req, res) => {
    const updated = await bookingService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(new ApiResponse(200, updated, "Booking status updated"));
  });
}

export default new BookingController();
