// src/controllers/StationController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import stationService from "../services/StationService.js";

class StationController {
  getAll = asyncHandler(async (req, res) => {
    const stations = await stationService.getAllStations(req.query.q);
    res.status(200).json(new ApiResponse(200, stations));
  });

  getById = asyncHandler(async (req, res) => {
    const station = await stationService.getStationById(req.params.id);
    res.status(200).json(new ApiResponse(200, station));
  });

  create = asyncHandler(async (req, res) => {
    const station = await stationService.createStation(req.body);
    res.status(201).json(new ApiResponse(201, station, "Station created"));
  });

  update = asyncHandler(async (req, res) => {
    const station = await stationService.updateStation(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, station, "Station updated"));
  });

  remove = asyncHandler(async (req, res) => {
    await stationService.deleteStation(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Station deleted"));
  });
}

export default new StationController();
