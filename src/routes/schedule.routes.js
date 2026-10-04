// src/routes/schedule.routes.js
import { Router } from "express";
import scheduleController from "../controllers/ScheduleController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public reads
router.get("/", scheduleController.getAll);
router.get("/route/:routeId", scheduleController.getByRoute);

// Admin only writes
router.use(verifyJWT, authorizeRoles("admin", "manager"));
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.delete("/:id", scheduleController.remove);

export default router;
