// src/repositories/BaseRepository.js

/**
 * Generic CRUD repository — every entity-specific repo extends this class.
 * All data access is centralised here; services never touch Mongoose directly.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filter = {}, populateFields = []) {
    let query = this.model.find(filter);
    populateFields.forEach((f) => (query = query.populate(f)));
    return query.lean();
  }

  async findAllPopulated(field) {
    return this.model.find({}).populate(field).lean();
  }

  async findById(id, populateFields = []) {
    let query = this.model.findById(id);
    populateFields.forEach((f) => (query = query.populate(f)));
    return query.lean();
  }

  async findOne(filter = {}, populateFields = []) {
    let query = this.model.findOne(filter);
    populateFields.forEach((f) => (query = query.populate(f)));
    return query.lean();
  }

  async create(data) {
    const doc = new this.model(data);
    return (await doc.save()).toObject();
  }

  async updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id).lean();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

export default BaseRepository;
