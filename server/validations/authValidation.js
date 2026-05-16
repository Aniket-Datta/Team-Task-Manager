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

module.exports = { signupSchema, loginSchema };
