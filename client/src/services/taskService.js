// ============================================
// services/taskService.js — All task API calls
// ============================================

import api from "./api";

// GET /api/tasks — fetch all tasks
// Admin gets all tasks, Member gets only their assigned tasks (handled by backend)
// Optional query filters: ?status=Pending&priority=High&project=<id>
export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.project) params.append("project", filters.project);

  const response = await api.get(`/tasks?${params.toString()}`);
  return response.data;
};

// GET /api/tasks/:id — fetch a single task by ID
export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// POST /api/tasks — create a new task (Admin only)
export const createTask = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

// PUT /api/tasks/:id — update a task
// Admin can update all fields, Member can only update status
export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

// DELETE /api/tasks/:id — delete a task (Admin only)
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// POST /api/tasks/:id/comments — add a comment to a task
export const addTaskComment = async (id, commentData) => {
  const response = await api.post(`/tasks/${id}/comments`, commentData);
  return response.data;
};
