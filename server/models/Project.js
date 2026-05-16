// ============================================
// models/Project.js — Mongoose schema for Project
// ============================================

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // Project title
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    // Project description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // The admin who created this project
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Team members assigned to this project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Project deadline
    deadline: {
      type: Date,
    },

    // Project progress (0 to 100)
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
