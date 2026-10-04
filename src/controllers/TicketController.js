// src/controllers/TicketController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ticketService from "../services/TicketService.js";

class TicketController {
  getByRef = asyncHandler(async (req, res) => {
    const ticket = await ticketService.getTicketByReference(req.params.ref);
    res.status(200).json(new ApiResponse(200, ticket));
  });

  cancel = asyncHandler(async (req, res) => {
    const ticket = await ticketService.cancelTicket(req.params.ref);
    res.status(200).json(new ApiResponse(200, ticket, "Ticket cancelled"));
  });
}

export default new TicketController();
