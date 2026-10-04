// src/repositories/RouteRepository.js
import BaseRepository from "./BaseRepository.js";
import Route from "../models/Route.model.js";

class RouteRepository extends BaseRepository {
  constructor() {
    super(Route);
  }

  async findByStations(sourceId, destinationId) {
    return this.model
      .findOne({ sourceStation: sourceId, destinationStation: destinationId, isActive: true })
      .populate("sourceStation")
      .populate("destinationStation")
      .lean();
  }

  async findAllPopulated() {
    return this.model
      .find({ isActive: true })
      .populate("sourceStation")
      .populate("destinationStation")
      .lean();
  }
}

export default new RouteRepository();
