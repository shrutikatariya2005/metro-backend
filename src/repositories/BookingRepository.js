// src/repositories/BookingRepository.js
import BaseRepository from "./BaseRepository.js";
import Booking from "../models/Booking.model.js";

class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }

  async findByUser(userId) {
    return this.model
      .find({ user: userId })
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .populate("schedule")
      .sort({ createdAt: -1 })
      .lean();
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
