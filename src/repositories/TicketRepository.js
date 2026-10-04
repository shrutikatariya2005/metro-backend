// src/repositories/TicketRepository.js
import BaseRepository from "./BaseRepository.js";
import Ticket from "../models/Ticket.model.js";

class TicketRepository extends BaseRepository {
  constructor() {
    super(Ticket);
  }

  async findByRef(ticketRef) {
    return this.model.findOne({ ticketRef }).populate("booking").lean();
  }

  async findByBooking(bookingId) {
    return this.model.findOne({ booking: bookingId }).lean();
  }
}

export default new TicketRepository();
