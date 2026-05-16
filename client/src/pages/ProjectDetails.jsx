// ============================================
// pages/ProjectDetails.jsx — Single project view with real backend data
// ============================================

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { getProjectById, deleteProject } from "../services/projectService";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  // ---- State ----
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Fetch project by ID on load ----
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProjectById(id);
        setProject(data.project);
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load project.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // ---- Handle delete ----
  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this project? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteProject(id);
      navigate("/projects"); // Go back to projects list
    } catch (err) {
      alert("Failed to delete project. Please try again.");
    }
  };

  // ---- Format date ----
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ---- Check if overdue ----
  const isOverdue =
    project?.deadline &&
    new Date(project.deadline) < new Date() &&
    project.progress < 100;

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading project...</p>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-lg font-medium text-slate-600 mb-2">{error}</p>
        <Link
          to="/projects"
          className="text-indigo-600 text-sm hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // ---- Project not found ----
  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg font-medium text-slate-600">Project not found</p>
        <Link to="/projects" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        ← Back to Projects
      </Link>

      {/* Project Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">{project.title}</h1>

              {/* Status badge */}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  project.progress === 100
                    ? "bg-emerald-100 text-emerald-700"
                    : isOverdue
                    ? "bg-rose-100 text-rose-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {project.progress === 100
                  ? "✅ Completed"
                  : isOverdue
                  ? "⚠️ Overdue"
                  : "🔄 In Progress"}
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              {project.description || "No description provided."}
            </p>
          </div>

          {/* Admin action buttons */}
          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                to="/projects"
                onClick={() => {}}
                className="px-3 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <ProgressBar progress={project.progress || 0} size="md" />
        </div>

        {/* Project meta info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">Created By</p>
            <p className="text-sm font-medium text-slate-700">
              {project.createdBy?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Deadline</p>
            <p className={`text-sm font-medium ${isOverdue ? "text-rose-600" : "text-slate-700"}`}>
              {formatDate(project.deadline)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Members</p>
            <p className="text-sm font-medium text-slate-700">
              {project.members?.length || 0} people
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Progress</p>
            <p className="text-sm font-medium text-slate-700">{project.progress || 0}%</p>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Team Members
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({project.members?.length || 0})
          </span>
        </h2>

        {project.members && project.members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.members.map((member, i) => (
              <div
                key={member._id || i}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {member.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {member.name || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {member.email || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg">
            <p className="text-slate-400 text-sm">No members assigned to this project.</p>
            {isAdmin && (
              <p className="text-xs text-slate-400 mt-1">
                You can add members when editing the project.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tasks placeholder — will be added in Phase 8 */}
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Project Tasks</h2>
        <p className="text-sm text-slate-400">
          Task management will be connected in the next phase.
        </p>
      </div>
    </div>
  );
};

export default ProjectDetails;
