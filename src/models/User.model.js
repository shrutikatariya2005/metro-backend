// src/models/User.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    contact: { type: String, trim: true },
    role: { type: String, enum: ["passenger", "admin"], default: "passenger" },
    isActive: { type: Boolean, default: true },
    aadhar: { type: String, trim: true },
    pan: { type: String, trim: true },
    qualification: { type: String, trim: true },
    address: { type: String, trim: true },
    photo: { type: String, trim: true },
    dob: { type: String, trim: true },
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

// Never return password hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

userSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
