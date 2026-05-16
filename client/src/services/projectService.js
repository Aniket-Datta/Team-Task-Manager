// ============================================
// services/projectService.js — All project API calls
// ============================================

import api from "./api";

// GET /api/projects — fetch all projects
// Admin gets all, Member gets only their projects (handled by backend)
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// GET /api/projects/:id — fetch a single project by ID
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// POST /api/projects — create a new project (Admin only)
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// PUT /api/projects/:id — update a project (Admin only)
export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

// DELETE /api/projects/:id — delete a project (Admin only)
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
