// src/controllers/ScheduleController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import scheduleService from "../services/ScheduleService.js";

class ScheduleController {
  getAll = asyncHandler(async (_req, res) => {
    const schedules = await scheduleService.getAllSchedules();
    res.status(200).json(new ApiResponse(200, schedules));
  });

  getByRoute = asyncHandler(async (req, res) => {
    const schedules = await scheduleService.getSchedulesByRoute(req.params.routeId);
    res.status(200).json(new ApiResponse(200, schedules));
  });

  create = asyncHandler(async (req, res) => {
    const { routeId, departureTime, arrivalTime, daysOfWeek } = req.body;
    const schedule = await scheduleService.createSchedule({ routeId, departureTime, arrivalTime, daysOfWeek });
    res.status(201).json(new ApiResponse(201, schedule, "Schedule created"));
  });

  update = asyncHandler(async (req, res) => {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, schedule, "Schedule updated"));
  });

  remove = asyncHandler(async (req, res) => {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Schedule deleted"));
  });
}

export default new ScheduleController();
