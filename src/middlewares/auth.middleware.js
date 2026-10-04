// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/UserRepository.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decodedToken.id);
    if (!user) throw new ApiError(401, "Invalid token");
    if (!user.isActive) throw new ApiError(403, "Account is deactivated");

    // .lean() returns { _id, ... } — add .id string alias so controllers can use req.user.id
    req.user = { ...user, id: user._id.toString() };
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) throw new ApiError(401, "Unauthorized request");
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role ${req.user.role} is not allowed to access this resource`);
    }
    next();
  };
};
