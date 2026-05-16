// ============================================
// controllers/projectController.js — Project business logic
// ============================================

const Project = require("../models/Project");
const { createProjectSchema, updateProjectSchema } = require("../validations/projectValidation");

// ---- CREATE PROJECT ----
// POST /api/projects (Admin only)
const createProject = async (req, res) => {
  try {
    // Step 1: Validate request body using Zod
    const validationResult = createProjectSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { title, description, members, deadline, progress } = validationResult.data;

    // Step 2: Create the project with createdBy set to logged-in admin
    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
      deadline: deadline ? new Date(deadline) : undefined,
      progress: progress || 0,
    });

    // Step 3: Return the created project
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error.message);
    res.status(500).json({ message: "Server error while creating project" });
  }
};

// ---- GET ALL PROJECTS ----
// GET /api/projects (Admin sees all, Member sees only their projects)
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      // Admin: Get all projects, populate createdBy and members with name & email
      projects = await Project.find()
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 }); // Newest first
    } else {
      // Member: Get only projects where they are a member
      projects = await Project.find({ members: req.user._id })
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ count: projects.length, projects });
  } catch (error) {
    console.error("Get Projects Error:", error.message);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

// ---- GET PROJECT BY ID ----
// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Members can only view projects they belong to
    if (
      req.user.role === "member" &&
      !project.members.some((member) => member._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied. You are not a member of this project." });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Get Project By ID Error:", error.message);
    res.status(500).json({ message: "Server error while fetching project" });
  }
};

// ---- UPDATE PROJECT ----
// PUT /api/projects/:id (Admin only)
const updateProject = async (req, res) => {
  try {
    // Step 1: Validate request body
    const validationResult = updateProjectSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Step 2: Find the project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Step 3: Update fields from validated data
    const { title, description, members, deadline, progress } = validationResult.data;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (members !== undefined) project.members = members;
    if (deadline !== undefined) project.deadline = new Date(deadline);
    if (progress !== undefined) project.progress = progress;

    // Step 4: Save updated project
    const updatedProject = await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error.message);
    res.status(500).json({ message: "Server error while updating project" });
  }
};

// ---- DELETE PROJECT ----
// DELETE /api/projects/:id (Admin only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error.message);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
