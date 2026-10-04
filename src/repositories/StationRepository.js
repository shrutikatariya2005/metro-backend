// src/repositories/StationRepository.js
import BaseRepository from "./BaseRepository.js";
import Station from "../models/Station.model.js";

class StationRepository extends BaseRepository {
  constructor() {
    super(Station);
  }

  async search(query) {
    const regex = new RegExp(query, "i");
    return this.model
      .find({ isActive: true, $or: [{ stationName: regex }, { stationCode: regex }, { location: regex }] })
      .lean();
  }
}

export default new StationRepository();
