// src/repositories/UserRepository.js
import BaseRepository from "./BaseRepository.js";
import User from "../models/User.model.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /** Used by AuthService — returns the raw Mongoose doc (with passwordHash) */
  async findByEmailWithPassword(email) {
    return this.model.findOne({ email });
  }

  async findByEmail(email) {
    return this.model.findOne({ email }).lean();
  }
}

export default new UserRepository();
