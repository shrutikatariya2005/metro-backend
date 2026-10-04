// src/controllers/AuthController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import authService from "../services/AuthService.js";

const isProduction = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict", // "none" required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json(new ApiResponse(201, user, "Registration successful"));
  });

  login = asyncHandler(async (req, res) => {
    const { token, user } = await authService.login(req.body);
    res
      .cookie("token", token, COOKIE_OPTIONS)
      .status(200)
      .json(new ApiResponse(200, { user }, "Login successful"));
  });

  logout = asyncHandler(async (_req, res) => {
    res
      .clearCookie("token", { ...COOKIE_OPTIONS, maxAge: 0 })
      .status(200)
      .json(new ApiResponse(200, null, "Logged out"));
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(new ApiResponse(200, result, "OTP sent to email"));
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, user } = await authService.verifyOtpAndResetPassword(req.body);
    res
      .cookie("token", token, COOKIE_OPTIONS)
      .status(200)
      .json(new ApiResponse(200, { user }, "Password reset and logged in successfully"));
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.status(200).json(new ApiResponse(200, user));
  });

  updateProfile = asyncHandler(async (req, res) => {
    // Only allow updating certain fields (prevent role override)
    const { name, contact, dob, address, photo, password } = req.body;
    const user = await authService.updateProfile(req.user.id, { name, contact, dob, address, photo, password });
    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
  });
}

export default new AuthController();
