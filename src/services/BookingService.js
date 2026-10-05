// src/services/BookingService.js
import ApiError from "../utils/ApiError.js";
import bookingRepository from "../repositories/BookingRepository.js";
import routeService from "./RouteService.js";
import fareService from "./FareService.js";
import ticketService from "./TicketService.js";
import generateReference from "../utils/generateReference.js";

class BookingService {
  async createBooking({ userId, routeId, scheduleId, passengerCount, travelDate }) {
    // 1. Validate route exists (delegates to RouteService)
    await routeService.getRouteById(routeId);

    // 2. Calculate fare (delegates to FareService — the ONLY place fare math happens)
    const fareDetails = await fareService.calculateFare(routeId, passengerCount);

    // 3. Create the booking record (starts as pending_payment until Razorpay confirms)
    const bookingRef = generateReference("BKG");
    const booking = await bookingRepository.create({
      bookingRef,
      user: userId,
      route: routeId,
      schedule: scheduleId,
      passengerCount,
      fareAmount: fareDetails.totalFare,
      travelDate,
      status: "pending_payment",
    });

    // 4. Return booking + fare details so frontend can initiate payment
    return { booking, fareDetails };
  }

  async getBookingHistory(userId) {
    return bookingRepository.findByUser(userId);
  }

  async getAllBookings() {
    return bookingRepository.findAllPopulated();
  }

  async cancelBooking(bookingRef, userId) {
    const booking = await bookingRepository.findByRef(bookingRef);
    if (!booking) throw new ApiError(404, "Booking not found");
    if (booking.user._id?.toString() !== userId.toString() && booking.user?.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to cancel this booking");
    }
    if (booking.status === "cancelled") throw new ApiError(400, "Booking is already cancelled");

    const updated = await bookingRepository.updateById(booking._id, { status: "cancelled" });
    await ticketService.cancelTicket({ booking: booking._id }).catch(() => {});
    return updated;
  }

  async updateStatus(id, status) {
    const allowed = ["confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) throw new ApiError(400, `Invalid status. Must be one of: ${allowed.join(", ")}`);
    const updated = await bookingRepository.updateById(id, { status });
    if (!updated) throw new ApiError(404, "Booking not found");
    return updated;
  }
}

export default new BookingService();
