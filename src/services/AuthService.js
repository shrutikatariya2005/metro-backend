// src/services/AuthService.js
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/UserRepository.js";
import mailService from "./MailService.js";

class AuthService {
  #generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async register({ name, email, password, contact }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ApiError(409, "Email is already registered");

    const user = await userRepository.create({
      name,
      email,
      passwordHash: password, // pre-save hook hashes it
      contact,
      role: "passenger",
    });

    return user;
  }

  async login({ email, password }) {
    const userDoc = await userRepository.findByEmailWithPassword(email);
    if (!userDoc) throw new ApiError(401, "Invalid email or password");
    if (!userDoc.isActive) throw new ApiError(403, "Account is deactivated");

    const isMatch = await userDoc.matchPassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = this.#generateToken(userDoc._id, userDoc.role);
    const safeUser = userDoc.toJSON();
    return { token, user: safeUser };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw new ApiError(404, "User with this email does not exist");
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    await mailService.sendOTP(user.email, otp);
    return { message: "OTP sent successfully" };
  }

  async verifyOtpAndResetPassword({ email, otp, newPassword }) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw new ApiError(404, "User with this email does not exist");

    if (user.resetOtp !== otp) throw new ApiError(400, "Invalid OTP");
    if (new Date() > user.resetOtpExpiry) throw new ApiError(400, "OTP has expired");

    user.passwordHash = newPassword; // Pre-save hook will hash it
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    const token = this.#generateToken(user._id, user.role);
    return { token, user: user.toJSON() };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }
}

export default new AuthService();
