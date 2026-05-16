// ============================================
// routes/authRoutes.js — Authentication routes
// ============================================

const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no token needed)
router.post("/signup", signup);   // POST /api/auth/signup
router.post("/login", login);     // POST /api/auth/login

// Protected route (token required)
router.get("/me", protect, getMe); // GET /api/auth/me

module.exports = router;
