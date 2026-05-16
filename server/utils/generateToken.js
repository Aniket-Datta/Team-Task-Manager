// ============================================
// utils/generateToken.js — JWT token generator
// ============================================

const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a given user ID
 * @param {string} userId - The MongoDB user _id
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
