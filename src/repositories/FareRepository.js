// src/repositories/FareRepository.js
import BaseRepository from "./BaseRepository.js";
import Fare from "../models/Fare.model.js";

class FareRepository extends BaseRepository {
  constructor() {
    super(Fare);
  }

  async findByRoute(routeId) {
    return this.model.findOne({ route: routeId }).lean();
  }

  async upsertByRoute(routeId, data) {
    return this.model
      .findOneAndUpdate({ route: routeId }, { ...data, route: routeId }, { new: true, upsert: true, runValidators: true })
      .lean();
  }
}

export default new FareRepository();
