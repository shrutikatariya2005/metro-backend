// src/routes/booking.routes.js
import { Router } from "express";
import bookingController from "../controllers/BookingController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Passenger reads/writes
router.use(verifyJWT);
router.post("/", bookingController.create);
router.get("/history", bookingController.getMyHistory);
router.put("/cancel/:bookingRef", bookingController.cancel);

// Admin reads/writes
router.get("/", authorizeRoles("admin"), bookingController.getAll);
router.put("/:id/status", authorizeRoles("admin"), bookingController.updateStatus);

export default router;
