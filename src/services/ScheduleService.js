// src/services/ScheduleService.js
import ApiError from "../utils/ApiError.js";
import scheduleRepository from "../repositories/ScheduleRepository.js";
import routeRepository from "../repositories/RouteRepository.js";

class ScheduleService {
  async getAllSchedules() {
    return scheduleRepository.findAllPopulated();
  }

  async getSchedulesByRoute(routeId) {
    const route = await routeRepository.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");
    return scheduleRepository.findByRoute(routeId);
  }

  async createSchedule({ routeId, departureTime, arrivalTime, daysOfWeek }) {
    const route = await routeRepository.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");

    // Validate HH:mm format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(departureTime)) throw new ApiError(400, "Invalid departure time format. Use HH:mm");
    if (!timeRegex.test(arrivalTime)) throw new ApiError(400, "Invalid arrival time format. Use HH:mm");

    return scheduleRepository.create({
      route: routeId,
      departureTime,
      arrivalTime,
      daysOfWeek: daysOfWeek ?? ["Mon", "Tue", "Wed", "Thu", "Fri"],
    });
  }

  async updateSchedule(id, data) {
    const schedule = await scheduleRepository.updateById(id, data);
    if (!schedule) throw new ApiError(404, "Schedule not found");
    return schedule;
  }

  async deleteSchedule(id) {
    const schedule = await scheduleRepository.deleteById(id);
    if (!schedule) throw new ApiError(404, "Schedule not found");
    return schedule;
  }
}

export default new ScheduleService();
