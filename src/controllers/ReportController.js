// src/controllers/ReportController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import reportService from "../services/ReportService.js";

class ReportController {
  getSummary = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const summary = await reportService.getSummary(startDate, endDate);
    res.status(200).json(new ApiResponse(200, summary));
  });

  getPopularRoutes = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const { startDate, endDate } = req.query;
    const routes = await reportService.getPopularRoutes(limit, startDate, endDate);
    res.status(200).json(new ApiResponse(200, routes));
  });

  getRevenueByDate = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getRevenueByDate(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data));
  });

  getDetailedBookings = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const data = await reportService.getDetailedBookings(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data));
  });

  getFeedbackStats = asyncHandler(async (_req, res) => {
    const stats = await reportService.getFeedbackStats();
    res.status(200).json(new ApiResponse(200, stats));
  });
}

export default new ReportController();
