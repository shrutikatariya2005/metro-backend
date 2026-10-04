// src/services/StationService.js
import ApiError from "../utils/ApiError.js";
import stationRepository from "../repositories/StationRepository.js";

class StationService {
  async getAllStations(query = "") {
    if (query) return stationRepository.search(query);
    return stationRepository.findAll({ isActive: true });
  }

  async getStationById(id) {
    const station = await stationRepository.findById(id);
    if (!station) throw new ApiError(404, "Station not found");
    return station;
  }

  async createStation({ stationCode, stationName, location }) {
    const existing = await stationRepository.findOne({ stationCode: stationCode.toUpperCase() });
    if (existing) throw new ApiError(409, `Station code ${stationCode} already exists`);
    return stationRepository.create({ stationCode, stationName, location });
  }

  async updateStation(id, data) {
    const station = await stationRepository.updateById(id, data);
    if (!station) throw new ApiError(404, "Station not found");
    return station;
  }

  async deleteStation(id) {
    const station = await stationRepository.deleteById(id);
    if (!station) throw new ApiError(404, "Station not found");
    return station;
  }
}

export default new StationService();
