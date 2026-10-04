// src/routes/report.routes.js
import { Router } from "express";
import reportController from "../controllers/ReportController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("manager", "admin"));

router.get("/summary", reportController.getSummary);
router.get("/popular-routes", reportController.getPopularRoutes);
router.get("/revenue", reportController.getRevenueByDate);
router.get("/feedback-stats", reportController.getFeedbackStats);

export default router;
