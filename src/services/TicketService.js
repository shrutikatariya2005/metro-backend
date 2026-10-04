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

  async cancelTicket(ticketRef) {
    const ticket = await ticketRepository.findOne({ ticketRef });
    if (!ticket) throw new ApiError(404, "Ticket not found");
    if (ticket.status === "cancelled") throw new ApiError(400, "Ticket is already cancelled");
    return ticketRepository.updateById(ticket._id, { status: "cancelled" });
  }
}

export default new TicketService();
