// src/repositories/BookingRepository.js
import BaseRepository from "./BaseRepository.js";
import Booking from "../models/Booking.model.js";

class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }

  async findByUser(userId) {
    const bookings = await this.model
      .find({ user: userId })
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .populate("schedule")
      .sort({ createdAt: -1 })
      .lean();

    // Attach issued ticket info to each booking if exists
    const Ticket = (await import("../models/Ticket.model.js")).default;
    const bookingIds = bookings.map((b) => b._id);
    const tickets = await Ticket.find({ booking: { $in: bookingIds } }).lean();
    const ticketMap = new Map(tickets.map((t) => [t.booking.toString(), t]));

    return bookings.map((b) => ({
      ...b,
      ticket: ticketMap.get(b._id.toString()) || null,
    }));
  }

  async findAllPopulated() {
    return this.model
      .find()
      .populate("user", "name email")
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .populate("schedule")
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByRef(bookingRef) {
    return this.model
      .findOne({ bookingRef })
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .lean();
  }
}

export default new BookingRepository();
