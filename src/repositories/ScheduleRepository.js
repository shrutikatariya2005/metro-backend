// src/repositories/ScheduleRepository.js
import BaseRepository from "./BaseRepository.js";
import Schedule from "../models/Schedule.model.js";

class ScheduleRepository extends BaseRepository {
  constructor() {
    super(Schedule);
  }

  async findByRoute(routeId) {
    return this.model
      .find({ route: routeId, isActive: true })
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .lean();
  }

  async findAllPopulated() {
    return this.model
      .find({})
      .sort({ departureTime: 1 })
      .populate({ path: "route", populate: [{ path: "sourceStation" }, { path: "destinationStation" }] })
      .lean();
  }
}

export default new ScheduleRepository();
