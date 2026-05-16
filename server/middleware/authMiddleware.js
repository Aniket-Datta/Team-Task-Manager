// ============================================
// middleware/authMiddleware.js — JWT token verification
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes
 * - Reads JWT token from the Authorization header
 * - Verifies the token
 * - Fetches full user from DB and attaches to req.user
 * - Blocks request if token is missing or invalid
 */
const protect = async (req, res, next) => {
  try {
    // Step 1: Get token from the Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Step 2: Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Step 3: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Fetch user from DB (without password) and attach to request
    // This gives us access to user.role in the role middleware
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;

    // Step 5: Continue to the next middleware/controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
