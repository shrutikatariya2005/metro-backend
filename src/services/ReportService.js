// src/services/ReportService.js
// ══════════════════════════════════════════════════════════════════════════════
// All report / statistics business logic lives here.
// Managers call these endpoints — no raw DB queries outside this service.
// ══════════════════════════════════════════════════════════════════════════════
import bookingRepository from "../repositories/BookingRepository.js";
import userRepository from "../repositories/UserRepository.js";
import stationRepository from "../repositories/StationRepository.js";
import routeRepository from "../repositories/RouteRepository.js";
import feedbackRepository from "../repositories/FeedbackRepository.js";

class ReportService {
  /**
   * High-level summary: counts + revenue.
   */
  async getSummary() {
    const [totalBookings, totalUsers, totalStations, totalRoutes, allBookings] = await Promise.all([
      bookingRepository.count(),
      userRepository.count({ role: "passenger" }),
      stationRepository.count({ isActive: true }),
      routeRepository.count({ isActive: true }),
      bookingRepository.findAll({ status: { $ne: "cancelled" } }),
    ]);

    const totalRevenue = allBookings.reduce((sum, b) => sum + b.fareAmount, 0);
    const confirmedBookings = allBookings.filter((b) => b.status === "confirmed").length;
    const completedBookings = allBookings.filter((b) => b.status === "completed").length;

    return {
      totalBookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      confirmedBookings,
      completedBookings,
      totalUsers,
      totalStations,
      totalRoutes,
    };
  }

  /**
   * Top routes ranked by booking count.
   */
  async getPopularRoutes(limit = 10) {
    const pipeline = [
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$route", count: { $sum: 1 }, totalRevenue: { $sum: "$fareAmount" } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "routes",
          localField: "_id",
          foreignField: "_id",
          as: "routeInfo",
        },
      },
      { $unwind: "$routeInfo" },
      {
        $lookup: {
          from: "stations",
          localField: "routeInfo.sourceStation",
          foreignField: "_id",
          as: "sourceStation",
        },
      },
      {
        $lookup: {
          from: "stations",
          localField: "routeInfo.destinationStation",
          foreignField: "_id",
          as: "destinationStation",
        },
      },
      { $unwind: "$sourceStation" },
      { $unwind: "$destinationStation" },
      {
        $project: {
          _id: 0,
          routeId: "$_id",
          summary: {
            $concat: ["$sourceStation.stationName", " → ", "$destinationStation.stationName"],
          },
          count: 1,
          totalRevenue: 1,
        },
      },
    ];

    return bookingRepository.aggregate(pipeline);
  }

  /**
   * Daily revenue breakdown (last N days).
   */
  async getRevenueByDate(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10); // "YYYY-MM-DD"

    const pipeline = [
      { $match: { travelDate: { $gte: sinceStr }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$travelDate",
          revenue: { $sum: "$fareAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1, bookings: 1 } },
    ];

    return bookingRepository.aggregate(pipeline);
  }

  /**
   * Average feedback rating.
   */
  async getFeedbackStats() {
    const all = await feedbackRepository.findAll();
    if (all.length === 0) return { averageRating: 0, totalFeedback: 0, distribution: {} };

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    all.forEach((f) => {
      sum += f.rating;
      distribution[f.rating] = (distribution[f.rating] || 0) + 1;
    });

    return {
      averageRating: Math.round((sum / all.length) * 10) / 10,
      totalFeedback: all.length,
      distribution,
    };
  }
}

export default new ReportService();
