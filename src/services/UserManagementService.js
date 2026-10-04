// src/services/UserManagementService.js
import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/UserRepository.js";

class UserManagementService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async createAdmin({ name, email, contact, password, aadhar, pan, qualification, dob, address, photo }) {
    const existing = await userRepository.findOne({ email });
    if (existing) throw new ApiError(400, "User with this email already exists");
    
    return userRepository.create({ 
      name, 
      email, 
      contact, 
      passwordHash: password, 
      aadhar,
      pan,
      qualification,
      dob,
      address,
      photo,
      role: "admin" 
    });
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateUserRole(id, role) {
    const allowedRoles = ["passenger", "admin"];
    if (!allowedRoles.includes(role)) throw new ApiError(400, `Role must be one of: ${allowedRoles.join(", ")}`);
    const user = await userRepository.updateById(id, { role });
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async toggleUserStatus(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return userRepository.updateById(id, { isActive: !user.isActive });
  }

  async deleteUser(id) {
    const user = await userRepository.deleteById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }
}

export default new UserManagementService();
