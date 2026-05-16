// ============================================
// pages/Projects.jsx — Polished Projects Page
// ============================================

import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";
import { getProjects, createProject, updateProject, deleteProject } from "../services/projectService";
import { PageLoader, EmptyState } from "../components/ui";

const Projects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSubmit = async (formData) => {
    if (editingProject) {
      await updateProject(editingProject._id, formData);
    } else {
      await createProject(formData);
    }
    handleCloseForm();
    fetchProjects();
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  if (loading) return <PageLoader message="Loading projects..." />;

  return (
    <div className="space-y-6 pb-8">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin ? `Managing ${projects.length} total projects` : `You are part of ${projects.length} projects`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <span>+</span>
            <span>New Project</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-xl">⚠️</span>
             <span className="font-medium">{error}</span>
          </div>
          <button onClick={fetchProjects} className="px-4 py-2 bg-white text-rose-600 rounded-lg text-sm font-semibold shadow-sm hover:bg-rose-100 transition-colors">
            Retry
          </button>
        </div>
      )}

      {!error && projects.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects found"
          description={isAdmin ? "It's quiet here. Create a new project to get your team moving!" : "You haven't been assigned to any projects yet."}
          action={isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Create Project
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="relative group h-full">
              <ProjectCard project={project} />

              {isAdmin && (
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); handleOpenEdit(project); }}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-md transition-all text-sm z-10"
                    title="Edit project"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(project._id); }}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-300 shadow-md transition-all text-sm z-10"
                    title="Delete project"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          initialData={editingProject}
        />
      )}
    </div>
  );
};

export default Projects;
