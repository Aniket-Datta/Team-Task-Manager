// ============================================
// validations/taskValidation.js — Zod schemas for tasks
// ============================================

const { z } = require("zod");

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Task title is required" })
    .min(1, "Task title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  assignedTo: z
    .string({ required_error: "Assigned user is required" })
    .min(1, "Assigned user is required"),

  project: z
    .string({ required_error: "Project is required" })
    .min(1, "Project is required"),

  priority: z
    .enum(["Low", "Medium", "High"], {
      invalid_type_error: "Priority must be Low, Medium, or High",
    })
    .optional(),

  status: z
    .enum(["Pending", "In Progress", "Completed"], {
      invalid_type_error: "Status must be Pending, In Progress, or Completed",
    })
    .optional(),

  dueDate: z
    .string()
    .optional(),
});

// Validation schema for updating a task
const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title cannot be empty")
    .max(100, "Title must be less than 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  assignedTo: z
    .string()
    .optional(),

  project: z
    .string()
    .optional(),

  priority: z
    .enum(["Low", "Medium", "High"], {
      invalid_type_error: "Priority must be Low, Medium, or High",
    })
    .optional(),

  status: z
    .enum(["Pending", "In Progress", "Completed"], {
      invalid_type_error: "Status must be Pending, In Progress, or Completed",
    })
    .optional(),

  dueDate: z
    .string()
    .optional(),
});

// Validation schema for adding a comment
const commentSchema = z.object({
  text: z
    .string({ required_error: "Comment text is required" })
    .min(1, "Comment text is required")
    .max(500, "Comment must be less than 500 characters"),
});

module.exports = { createTaskSchema, updateTaskSchema, commentSchema };
