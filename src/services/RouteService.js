// src/services/RouteService.js
import ApiError from "../utils/ApiError.js";
import routeRepository from "../repositories/RouteRepository.js";
import stationRepository from "../repositories/StationRepository.js";
import scheduleRepository from "../repositories/ScheduleRepository.js";

class RouteService {
  async getAllRoutes() {
    return routeRepository.findAllPopulated();
  }

  async getRouteById(id) {
    const route = await routeRepository.findById(id, ["sourceStation", "destinationStation"]);
    if (!route) throw new ApiError(404, "Route not found");
    return route;
  }

  async searchRoute(sourceId, destinationId) {
    const route = await routeRepository.findByStations(sourceId, destinationId);
    if (!route) throw new ApiError(404, "No available route between the selected stations");
    return route;
  }

  async getSchedulesForRoute(routeId, time) {
    const schedules = await scheduleRepository.findByRoute(routeId);
    if (!time) return schedules;
    
    const sorted = schedules
      .filter(s => s.departureTime >= time)
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      
    return sorted.slice(0, 5); // Return next 5 schedules
  }

  async createRoute({ sourceStation, destinationStation, distanceKm, stops, estimatedTimeMinutes }) {
    const src = await stationRepository.findById(sourceStation);
    if (!src) throw new ApiError(404, "Source station not found");
    const dst = await stationRepository.findById(destinationStation);
    if (!dst) throw new ApiError(404, "Destination station not found");
    if (sourceStation === destinationStation) throw new ApiError(400, "Source and destination cannot be the same");

    const existing = await routeRepository.findByStations(sourceStation, destinationStation);
    if (existing) throw new ApiError(409, "A route between these stations already exists");

    return routeRepository.create({ sourceStation, destinationStation, distanceKm, stops, estimatedTimeMinutes });
  }

  async updateRoute(id, data) {
    const route = await routeRepository.updateById(id, data);
    if (!route) throw new ApiError(404, "Route not found");
    return route;
  }

  async deleteRoute(id) {
    const route = await routeRepository.deleteById(id);
    if (!route) throw new ApiError(404, "Route not found");
    return route;
  }
}

export default new RouteService();
