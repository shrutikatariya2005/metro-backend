// src/routes/route.routes.js
import { Router } from "express";
import routeController from "../controllers/RouteController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public reads
router.get("/search", routeController.search);
router.get("/", routeController.getAll);
router.get("/:id", routeController.getById);
router.get("/:id/schedules", routeController.getSchedules);

// Admin only writes
router.use(verifyJWT, authorizeRoles("admin", "manager"));
router.post("/", routeController.create);
router.put("/:id", routeController.update);
router.delete("/:id", routeController.remove);

export default router;
