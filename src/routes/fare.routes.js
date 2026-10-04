// src/routes/fare.routes.js
import { Router } from "express";
import fareController from "../controllers/FareController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public read / calculate
router.get("/", fareController.getAll);
router.get("/calculate", fareController.calculate);
router.get("/route/:routeId", fareController.getFareByRoute);

// Admin only write
router.use(verifyJWT, authorizeRoles("admin", "manager"));
router.post("/route/:routeId", fareController.setFare);

export default router;
