// ============================================
// components/ProjectForm.jsx — Create/Edit project modal form
// ============================================

import { useState, useEffect } from "react";

const ProjectForm = ({ onSubmit, onClose, initialData = null }) => {
  // initialData is passed when editing an existing project
  const isEditing = !!initialData;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing an existing project
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      // Format date to yyyy-mm-dd for input[type="date"]
      setDeadline(
        initialData.deadline
          ? new Date(initialData.deadline).toISOString().split("T")[0]
          : ""
      );
      setProgress(initialData.progress || 0);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    setLoading(true);
    try {
      // Pass form data to parent (Projects.jsx handles the API call)
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || undefined,
        progress: Number(progress),
      });
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-Commerce Platform"
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
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Progress: <span className="text-indigo-600 font-semibold">{progress}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full h-2 accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
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
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? isEditing ? "Saving..." : "Creating..."
                : isEditing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
