// ============================================
// middleware/roleMiddleware.js — Role-based access control
// ============================================

/**
 * Middleware to restrict access based on user roles
 * Usage: authorizeRoles("admin") or authorizeRoles("admin", "member")
 *
 * @param  {...string} roles - Allowed roles (e.g., "admin", "member")
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the protect middleware (authMiddleware.js)
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized for this action.`,
      });
    }

    // User has the required role, continue
    next();
  };
};

module.exports = { authorizeRoles };
