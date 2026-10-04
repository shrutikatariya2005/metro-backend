// src/services/FeedbackService.js
import ApiError from "../utils/ApiError.js";
import feedbackRepository from "../repositories/FeedbackRepository.js";

class FeedbackService {
  async submitFeedback({ userId, rating, comments }) {
    if (rating < 1 || rating > 5) throw new ApiError(400, "Rating must be between 1 and 5");
    return feedbackRepository.create({ user: userId, rating, comments });
  }

  async getAllFeedback() {
    return feedbackRepository.findAllPopulated();
  }

  async getFeedbackByUser(userId) {
    return feedbackRepository.findByUser(userId);
  }

  async deleteFeedback(id) {
    const entry = await feedbackRepository.deleteById(id);
    if (!entry) throw new ApiError(404, "Feedback not found");
    return entry;
  }
}

export default new FeedbackService();
