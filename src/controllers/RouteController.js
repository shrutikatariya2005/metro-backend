// src/controllers/RouteController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import routeService from "../services/RouteService.js";

class RouteController {
  getAll = asyncHandler(async (_req, res) => {
    const routes = await routeService.getAllRoutes();
    res.status(200).json(new ApiResponse(200, routes));
  });

  getById = asyncHandler(async (req, res) => {
    const route = await routeService.getRouteById(req.params.id);
    res.status(200).json(new ApiResponse(200, route));
  });

  getSchedules = asyncHandler(async (req, res) => {
    const { time } = req.query;
    const schedules = await routeService.getSchedulesForRoute(req.params.id, time);
    res.status(200).json(new ApiResponse(200, schedules));
  });

  search = asyncHandler(async (req, res) => {
    const { sourceId, destinationId } = req.query;
    const route = await routeService.searchRoute(sourceId, destinationId);
    res.status(200).json(new ApiResponse(200, route));
  });

  create = asyncHandler(async (req, res) => {
    const route = await routeService.createRoute(req.body);
    res.status(201).json(new ApiResponse(201, route, "Route created"));
  });

  update = asyncHandler(async (req, res) => {
    const route = await routeService.updateRoute(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, route, "Route updated"));
  });

  remove = asyncHandler(async (req, res) => {
    await routeService.deleteRoute(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Route deleted"));
  });
}

export default new RouteController();
