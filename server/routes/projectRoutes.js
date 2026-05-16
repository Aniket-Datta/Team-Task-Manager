// ============================================
// routes/projectRoutes.js — Project API routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All project routes require authentication (protect middleware)

// GET /api/projects — Admin sees all, Member sees their projects
router.get("/", protect, getProjects);

// GET /api/projects/:id — Get single project by ID
router.get("/:id", protect, getProjectById);

// POST /api/projects — Admin only: Create a new project
router.post("/", protect, authorizeRoles("admin"), createProject);

// PUT /api/projects/:id — Admin only: Update a project
router.put("/:id", protect, authorizeRoles("admin"), updateProject);

// DELETE /api/projects/:id — Admin only: Delete a project
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

module.exports = router;
