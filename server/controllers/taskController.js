// ============================================
// controllers/taskController.js — Task business logic
// ============================================

const Task = require("../models/Task");
const Project = require("../models/Project");
const {
  createTaskSchema,
  updateTaskSchema,
  commentSchema,
} = require("../validations/taskValidation");

// ---- HELPER: Update Project Progress ----
// Calculates the percentage of completed tasks in a project
// and updates the project's progress field automatically
const updateProjectProgress = async (projectId) => {
  try {
    // Count total tasks in this project
    const totalTasks = await Task.countDocuments({ project: projectId });

    // Count completed tasks in this project
    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: "Completed",
    });

    // Calculate progress percentage (avoid division by zero)
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Update the project's progress field
    await Project.findByIdAndUpdate(projectId, { progress });
  } catch (error) {
    console.error("Update Project Progress Error:", error.message);
  }
};

// ---- CREATE TASK ----
// POST /api/tasks (Admin only)
const createTask = async (req, res) => {
  try {
    // Step 1: Validate request body using Zod
    const validationResult = createTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { title, description, assignedTo, project, priority, status, dueDate } =
      validationResult.data;

    // Step 2: Check if the project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Step 3: Create the task
    const task = await Task.create({
      title,
      description,
      assignedTo,
      project,
      priority: priority || "Medium",
      status: status || "Pending",
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    // Step 4: Update project progress after adding a new task
    await updateProjectProgress(project);

    // Step 5: Return the created task
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error.message);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// ---- GET ALL TASKS ----
// GET /api/tasks (Admin sees all, Member sees only assigned tasks)
// Supports query filters: ?project=<id>&status=<status>&priority=<priority>
const getTasks = async (req, res) => {
  try {
    // Build filter object from query parameters
    const filter = {};

    // Filter by project if provided
    if (req.query.project) {
      filter.project = req.query.project;
    }

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by priority if provided
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Members can only see their assigned tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .populate("comments.createdBy", "name")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error.message);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// ---- GET TASK BY ID ----
// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .populate("comments.createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Members can only view tasks assigned to them
    if (
      req.user.role === "member" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied. This task is not assigned to you." });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Get Task By ID Error:", error.message);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

// ---- UPDATE TASK ----
// PUT /api/tasks/:id
// Admin: can update all fields
// Member: can only update status of their assigned tasks
const updateTask = async (req, res) => {
  try {
    // Step 1: Validate request body
    const validationResult = updateTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Step 2: Find the task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Step 3: Role-based update restrictions
    if (req.user.role === "member") {
      // Check if task is assigned to this member
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied. This task is not assigned to you." });
      }

      // Members can ONLY update the status field
      const allowedFields = ["status"];
      const requestedFields = Object.keys(validationResult.data);
      const hasDisallowedField = requestedFields.some(
        (field) => !allowedFields.includes(field)
      );

      if (hasDisallowedField) {
        return res.status(403).json({
          message: "Members can only update the task status.",
        });
      }
    }

    // Step 4: Update the task fields
    const { title, description, assignedTo, project, priority, status, dueDate } =
      validationResult.data;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (project !== undefined) task.project = project;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);

    // Step 5: Save updated task
    const updatedTask = await task.save();

    // Step 6: Update project progress if status changed
    if (status !== undefined) {
      await updateProjectProgress(task.project);
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error.message);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// ---- DELETE TASK ----
// DELETE /api/tasks/:id (Admin only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Store project ID before deleting (to update progress after)
    const projectId = task.project;

    await Task.findByIdAndDelete(req.params.id);

    // Update project progress after deleting a task
    await updateProjectProgress(projectId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error.message);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};

// ---- ADD COMMENT TO TASK ----
// POST /api/tasks/:id/comments
// Admin: can comment on any task
// Member: can comment only on assigned tasks
const addTaskComment = async (req, res) => {
  try {
    // Step 1: Validate comment text
    const validationResult = commentSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Step 2: Find the task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Step 3: Members can only comment on their assigned tasks
    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied. This task is not assigned to you." });
    }

    // Step 4: Add the comment
    const newComment = {
      text: validationResult.data.text,
      createdBy: req.user._id,
    };

    task.comments.push(newComment);
    await task.save();

    // Step 5: Return updated task with populated comments
    const updatedTask = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .populate("comments.createdBy", "name email");

    res.status(201).json({
      message: "Comment added successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Add Comment Error:", error.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
};
