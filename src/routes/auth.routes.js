// src/routes/auth.routes.js
import { Router } from "express";
import authController from "../controllers/AuthController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", verifyJWT, authController.getMe);
router.put("/update", verifyJWT, authController.updateProfile);

export default router;
