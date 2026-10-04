// src/controllers/FareController.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import fareService from "../services/FareService.js";

class FareController {
  getAll = asyncHandler(async (req, res) => {
    const fares = await fareService.getAllFares();
    res.status(200).json(new ApiResponse(200, fares));
  });

  setFare = asyncHandler(async (req, res) => {
    const fare = await fareService.setFare(req.params.routeId, req.body);
    res.status(200).json(new ApiResponse(200, fare, "Fare set successfully"));
  });

  calculate = asyncHandler(async (req, res) => {
    const { routeId, passengerCount = 1 } = req.query;
    const result = await fareService.calculateFare(routeId, Number(passengerCount));
    res.status(200).json(new ApiResponse(200, result));
  });

  getFareByRoute = asyncHandler(async (req, res) => {
    const fare = await fareService.getFareByRoute(req.params.routeId);
    res.status(200).json(new ApiResponse(200, fare));
  });
}

export default new FareController();
