// src/services/FareService.js
// ══════════════════════════════════════════════════════════════════════════════
// SINGLE SOURCE OF TRUTH for all fare calculations.
// No other service, controller, or frontend code should perform fare math.
// ══════════════════════════════════════════════════════════════════════════════
import ApiError from "../utils/ApiError.js";
import fareRepository from "../repositories/FareRepository.js";
import routeRepository from "../repositories/RouteRepository.js";

class FareService {
  async getAllFares() {
    return fareRepository.findAllPopulated("route");
  }

  /**
   * Set (create or update) the fare for a route.
   * Only admins should reach this — enforced at the route level.
   */
  async setFare(routeId, { baseFare, taxRate = 0 }) {
    const route = await routeRepository.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");
    return fareRepository.upsertByRoute(routeId, { baseFare, taxRate });
  }

  /**
   * Calculate total fare for a given route + passenger count.
   * Formula: totalFare = baseFare * passengerCount * (1 + taxRate/100)
   */
  async calculateFare(routeId, passengerCount = 1) {
    if (passengerCount < 1) throw new ApiError(400, "Passenger count must be at least 1");

    const fare = await fareRepository.findByRoute(routeId);
    if (!fare) throw new ApiError(404, "No fare configured for this route");

    const subtotal = fare.baseFare * passengerCount;
    const tax = subtotal * (fare.taxRate / 100);
    const totalFare = Math.round((subtotal + tax) * 100) / 100;

    return {
      routeId,
      baseFare: fare.baseFare,
      taxRate: fare.taxRate,
      passengerCount,
      subtotal,
      tax: Math.round(tax * 100) / 100,
      totalFare,
    };
  }

  async getFareByRoute(routeId) {
    const fare = await fareRepository.findByRoute(routeId);
    if (!fare) throw new ApiError(404, "No fare configured for this route");
    return fare;
  }
}

export default new FareService();
