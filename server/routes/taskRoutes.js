// ============================================
// routes/taskRoutes.js — Task API routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All task routes require authentication (protect middleware)

// GET /api/tasks — Admin sees all, Member sees assigned tasks
router.get("/", protect, getTasks);

// GET /api/tasks/:id — Get single task (member restricted in controller)
router.get("/:id", protect, getTaskById);

// POST /api/tasks — Admin only: Create a new task
router.post("/", protect, authorizeRoles("admin"), createTask);

// PUT /api/tasks/:id — Both roles can update (member restricted in controller)
router.put("/:id", protect, updateTask);

// DELETE /api/tasks/:id — Admin only: Delete a task
router.delete("/:id", protect, authorizeRoles("admin"), deleteTask);

// POST /api/tasks/:id/comments — Both roles can comment (member restricted in controller)
router.post("/:id/comments", protect, addTaskComment);

module.exports = router;
