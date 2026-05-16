// ============================================
// components/TaskForm.jsx — Create/Edit task modal form
// ============================================

import { useState, useEffect } from "react";
import api from "../services/api";

const TaskForm = ({ onSubmit, onClose, initialData = null }) => {
  const isEditing = !!initialData;

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");

  // Dropdown data from backend
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---- Fetch users and projects for dropdowns ----
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch projects list
        const projectsRes = await api.get("/projects");
        setProjects(projectsRes.data.projects || []);

        // Fetch all users (we'll use auth/me approach — fetch members from projects)
        // Since there's no /api/users endpoint yet, we extract unique members from projects
        const allMembers = [];
        const memberIds = new Set();
        (projectsRes.data.projects || []).forEach((p) => {
          (p.members || []).forEach((m) => {
            if (!memberIds.has(m._id)) {
              memberIds.add(m._id);
              allMembers.push(m);
            }
          });
          // Also add createdBy
          if (p.createdBy && !memberIds.has(p.createdBy._id)) {
            memberIds.add(p.createdBy._id);
            allMembers.push(p.createdBy);
          }
        });
        setUsers(allMembers);
      } catch (err) {
        console.error("Failed to load dropdown data:", err.message);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  // ---- Pre-fill form when editing ----
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setAssignedTo(initialData.assignedTo?._id || initialData.assignedTo || "");
      setProject(initialData.project?._id || initialData.project || "");
      setPriority(initialData.priority || "Medium");
      setStatus(initialData.status || "Pending");
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Task title is required");
    if (!assignedTo) return setError("Please select a user to assign");
    if (!project) return setError("Please select a project");

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        project,
        priority,
        status,
        dueDate: dueDate || undefined,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design homepage UI"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign To <span className="text-rose-500">*</span>
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">
                {loadingDropdowns ? "Loading users..." : "Select a user"}
              </option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">
                {loadingDropdowns ? "Loading projects..." : "Select a project"}
              </option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Status side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? isEditing ? "Saving..." : "Creating..."
                : isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
