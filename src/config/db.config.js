// src/config/db.config.js
import mongoose from "mongoose";

class Database {
  constructor() {
    this._connection = null;
  }

  async connect(uri) {
    if (this._connection) return this._connection;
    this._connection = await mongoose.connect(uri);
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
    return this._connection;
  }
}

export default new Database();
