// src/controllers/UserManagementController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userManagementService from "../services/UserManagementService.js";

class UserManagementController {
  getAll = asyncHandler(async (_req, res) => {
    const users = await userManagementService.getAllUsers();
    res.status(200).json(new ApiResponse(200, users));
  });

  createAdmin = asyncHandler(async (req, res) => {
    const user = await userManagementService.createAdmin(req.body);
    res.status(201).json(new ApiResponse(201, user, "Admin created successfully"));
  });

  getById = asyncHandler(async (req, res) => {
    const user = await userManagementService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, user));
  });

  updateRole = asyncHandler(async (req, res) => {
    const user = await userManagementService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json(new ApiResponse(200, user, "User role updated"));
  });

  toggleStatus = asyncHandler(async (req, res) => {
    const user = await userManagementService.toggleUserStatus(req.params.id);
    res.status(200).json(new ApiResponse(200, user, "User status toggled"));
  });

  remove = asyncHandler(async (req, res) => {
    await userManagementService.deleteUser(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "User deleted"));
  });
}

export default new UserManagementController();
