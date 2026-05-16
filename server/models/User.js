// ============================================
// models/User.js — Mongoose schema for User
// ============================================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // User's email (must be unique)
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (never store plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // User role — determines permissions
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
