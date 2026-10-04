// src/routes/payment.routes.js
import { Router } from "express";
import paymentController from "../controllers/PaymentController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All payment routes require authentication
router.use(verifyJWT);

router.post("/create-order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);

export default router;
