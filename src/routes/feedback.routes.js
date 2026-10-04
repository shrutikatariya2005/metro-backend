// src/routes/feedback.routes.js
import { Router } from "express";
import feedbackController from "../controllers/FeedbackController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Passenger
router.post("/", feedbackController.submit);
router.get("/my-feedback", feedbackController.getMyFeedback);

// Admin / Manager
router.get("/", authorizeRoles("admin", "manager"), feedbackController.getAll);
router.delete("/:id", authorizeRoles("admin"), feedbackController.remove);

export default router;
