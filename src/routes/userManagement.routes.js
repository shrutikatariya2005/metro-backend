// src/routes/userManagement.routes.js
import { Router } from "express";
import userManagementController from "../controllers/UserManagementController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("admin"));

router.get("/", userManagementController.getAll);
router.post("/admin", userManagementController.createAdmin);
router.get("/:id", userManagementController.getById);
router.put("/:id/role", userManagementController.updateRole);
router.put("/:id/status", userManagementController.toggleStatus);
router.delete("/:id", userManagementController.remove);

export default router;
