// ============================================
// validations/authValidation.js — Zod schemas for auth
// ============================================

const { z } = require("zod");

// Validation schema for user signup
const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),

  role: z
    .enum(["admin", "member"], {
      invalid_type_error: "Role must be either admin or member",
    })
    .optional(), // Role is optional, defaults to "member" in the model
});

// Validation schema for user login
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// Validation schema for profile update
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  email: z
    .string()
    .email("Please provide a valid email")
    .optional(),
}).refine(data => data.name || data.email, {
  message: "At least one field (name or email) must be provided",
});

module.exports = { signupSchema, loginSchema, updateProfileSchema };
