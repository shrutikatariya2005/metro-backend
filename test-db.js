import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

async function checkUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB:", process.env.MONGO_URI);
  
  const user = await User.findOne({ email: "priya.sharma@gmail.com" });
  if (!user) {
    console.log("User not found!");
  } else {
    console.log("User found:", user.email);
    console.log("Hashed pass in DB:", user.passwordHash);
    const match = await bcrypt.compare("password", user.passwordHash);
    console.log("Does 'password' match hash?", match);
    
    // Also check admin
    const admin = await User.findOne({ email: "admin@metro.com" });
    if (admin) {
      console.log("Admin found:", admin.email);
      const adminMatch = await bcrypt.compare("password", admin.passwordHash);
      console.log("Does 'password' match admin hash?", adminMatch);
    }
  }
  process.exit(0);
}
checkUser();
