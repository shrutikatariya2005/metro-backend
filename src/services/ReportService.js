// src/services/ReportService.js
import bookingRepository from "../repositories/BookingRepository.js";
import userRepository from "../repositories/UserRepository.js";
import stationRepository from "../repositories/StationRepository.js";
import routeRepository from "../repositories/RouteRepository.js";
import feedbackRepository from "../repositories/FeedbackRepository.js";

class ReportService {
  async getSummary(startDate, endDate) {
    const bookingMatch = { status: { $ne: "cancelled" } };
    if (startDate || endDate) {
      bookingMatch.travelDate = {};
      if (startDate) bookingMatch.travelDate.$gte = startDate;
      if (endDate) bookingMatch.travelDate.$lte = endDate;
    }

    const [totalBookings, totalUsers, totalStations, totalRoutes, allBookings] = await Promise.all([
      bookingRepository.count(bookingMatch),
      userRepository.count({ role: "passenger" }), // users are independent of this date range usually, or we can filter by createdAt
      stationRepository.count({ isActive: true }),
      routeRepository.count({ isActive: true }),
      bookingRepository.findAll(bookingMatch),
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

  async getPopularRoutes(limit = 10, startDate, endDate) {
    const matchStage = { status: { $ne: "cancelled" } };
    if (startDate || endDate) {
      matchStage.travelDate = {};
      if (startDate) matchStage.travelDate.$gte = startDate;
      if (endDate) matchStage.travelDate.$lte = endDate;
    }

    const pipeline = [
      { $match: matchStage },
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

  async getRevenueByDate(startDate, endDate) {
    const matchStage = { status: { $ne: "cancelled" } };
    if (startDate || endDate) {
      matchStage.travelDate = {};
      if (startDate) matchStage.travelDate.$gte = startDate;
      if (endDate) matchStage.travelDate.$lte = endDate;
    } else {
      // Default to last 30 days if no range provided
      const since = new Date();
      since.setDate(since.getDate() - 30);
      matchStage.travelDate = { $gte: since.toISOString().slice(0, 10) };
    }

    const pipeline = [
      { $match: matchStage },
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
