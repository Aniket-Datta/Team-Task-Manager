// ============================================
// models/Task.js — Mongoose schema for Task
// ============================================

const mongoose = require("mongoose");

// Sub-schema for task comments
const commentSchema = new mongoose.Schema({
  // Comment text
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
  },

  // Who wrote this comment
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // When the comment was added
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new mongoose.Schema(
  {
    // Task title
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    // Task description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // The team member this task is assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned user is required"],
    },

    // The project this task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },

    // Task priority level
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // Task completion status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // Task due date
    dueDate: {
      type: Date,
    },

    // Array of comments on this task
    comments: [commentSchema],
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
