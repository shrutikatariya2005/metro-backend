// src/routes/station.routes.js
import { Router } from "express";
import stationController from "../controllers/StationController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public reads
router.get("/", stationController.getAll);
router.get("/:id", stationController.getById);

// Admin only writes
router.use(verifyJWT, authorizeRoles("admin", "manager"));
router.post("/", stationController.create);
router.put("/:id", stationController.update);
router.delete("/:id", stationController.remove);

export default router;
