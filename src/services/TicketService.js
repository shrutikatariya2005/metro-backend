// src/services/TicketService.js
import ApiError from "../utils/ApiError.js";
import ticketRepository from "../repositories/TicketRepository.js";
import generateReference from "../utils/generateReference.js";

class TicketService {
  async issueTicket(bookingId) {
    const ticketRef = generateReference("TKT");
    // Ticket valid for 2 hours
    const validUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return ticketRepository.create({ booking: bookingId, ticketRef, validUntil });
  }

  async getTicketByReference(ticketRef) {
    const ticket = await ticketRepository.findByRef(ticketRef);
    if (!ticket) throw new ApiError(404, "Ticket not found");
    return ticket;
  }

  async cancelTicket(ticketRefOrQuery) {
    // Support being called with a query object e.g. { booking: bookingId }
    // or a plain string ticketRef
    let ticket;
    if (typeof ticketRefOrQuery === "string") {
      ticket = await ticketRepository.findOne({ ticketRef: ticketRefOrQuery });
    } else {
      ticket = await ticketRepository.findOne(ticketRefOrQuery);
    }
    if (!ticket) return null; // Gracefully ignore if ticket not found
    if (ticket.status === "cancelled") return ticket; // Already cancelled, no-op
    return ticketRepository.updateById(ticket._id, { status: "cancelled" });
  }
}

export default new TicketService();
