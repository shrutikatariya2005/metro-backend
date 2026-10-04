// src/controllers/FeedbackController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import feedbackService from "../services/FeedbackService.js";

class FeedbackController {
  submit = asyncHandler(async (req, res) => {
    const entry = await feedbackService.submitFeedback({
      userId: req.user.id,
      ...req.body,
    });
    res.status(201).json(new ApiResponse(201, entry, "Feedback submitted"));
  });

  getAll = asyncHandler(async (_req, res) => {
    const list = await feedbackService.getAllFeedback();
    res.status(200).json(new ApiResponse(200, list));
  });

  getMyFeedback = asyncHandler(async (req, res) => {
    const list = await feedbackService.getFeedbackByUser(req.user.id);
    res.status(200).json(new ApiResponse(200, list));
  });

  remove = asyncHandler(async (req, res) => {
    await feedbackService.deleteFeedback(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Feedback deleted"));
  });
}

export default new FeedbackController();
