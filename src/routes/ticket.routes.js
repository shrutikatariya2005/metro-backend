// src/routes/ticket.routes.js
import { Router } from "express";
import ticketController from "../controllers/TicketController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get("/:ref", ticketController.getByRef);
router.put("/cancel/:ref", ticketController.cancel);

export default router;
