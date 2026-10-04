// src/controllers/ReportController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import reportService from "../services/ReportService.js";

class ReportController {
  getSummary = asyncHandler(async (_req, res) => {
    const summary = await reportService.getSummary();
    res.status(200).json(new ApiResponse(200, summary));
  });

  getPopularRoutes = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const routes = await reportService.getPopularRoutes(limit);
    res.status(200).json(new ApiResponse(200, routes));
  });

  getRevenueByDate = asyncHandler(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days, 10) : 30;
    const data = await reportService.getRevenueByDate(days);
    res.status(200).json(new ApiResponse(200, data));
  });

  getFeedbackStats = asyncHandler(async (_req, res) => {
    const stats = await reportService.getFeedbackStats();
    res.status(200).json(new ApiResponse(200, stats));
  });
}

export default new ReportController();
