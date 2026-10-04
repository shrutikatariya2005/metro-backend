// src/repositories/FeedbackRepository.js
import BaseRepository from "./BaseRepository.js";
import Feedback from "../models/Feedback.model.js";

class FeedbackRepository extends BaseRepository {
  constructor() {
    super(Feedback);
  }

  async findAllPopulated() {
    return this.model
      .find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByUser(userId) {
    return this.model.find({ user: userId }).sort({ createdAt: -1 }).lean();
  }
}

export default new FeedbackRepository();
