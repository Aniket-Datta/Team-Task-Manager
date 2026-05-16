// ============================================
// validations/projectValidation.js — Zod schemas for projects
// ============================================

const { z } = require("zod");

// Validation schema for creating a project
const createProjectSchema = z.object({
  title: z
    .string({ required_error: "Project title is required" })
    .min(1, "Project title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  members: z
    .array(z.string(), {
      invalid_type_error: "Members must be an array of user IDs",
    })
    .optional(),

  deadline: z
    .string()
    .optional(), // Will be converted to Date in the controller

  progress: z
    .number()
    .min(0, "Progress must be at least 0")
    .max(100, "Progress must be at most 100")
    .optional(),
});

// Validation schema for updating a project
const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title cannot be empty")
    .max(100, "Title must be less than 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  members: z
    .array(z.string(), {
      invalid_type_error: "Members must be an array of user IDs",
    })
    .optional(),

  deadline: z
    .string()
    .optional(),

  progress: z
    .number()
    .min(0, "Progress must be at least 0")
    .max(100, "Progress must be at most 100")
    .optional(),
});

module.exports = { createProjectSchema, updateProjectSchema };
