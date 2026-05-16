// ============================================
// pages/Dashboard.jsx — Polished real data dashboard
// ============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";
import ProgressBar from "../components/ProgressBar";
import { StatCard, PageLoader, EmptyState, Badge } from "../components/ui";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);
        setProjects(projectsData.projects || []);
        setTasks(tasksData.tasks || []);
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const today = new Date();

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "Completed").length,
    pendingTasks: tasks.filter((t) => t.status === "Pending").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    overdueTasks: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== "Completed"
    ).length,
  };

  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== "Completed"
  );

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const myPendingTasks = tasks.filter((t) => t.status === "Pending");
  const myCompletedTasks = tasks.filter((t) => t.status === "Completed");

  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) return <PageLoader message="Loading your workspace..." />;

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Oops! Something went wrong"
        description={error}
        action={
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Refresh Page
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* ---- Welcome Banner ---- */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 blur-xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
             <p className="text-indigo-100 text-lg">
               {isAdmin ? "Here is the latest overview of your team's progress." : "Ready to crush your tasks today?"}
             </p>
           </div>
           <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                 {isAdmin ? "👑" : "💼"}
              </div>
              <div>
                 <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Account Role</p>
                 <p className="font-bold text-lg capitalize">{user?.role}</p>
              </div>
           </div>
        </div>
      </div>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard title="Projects" value={stats.totalProjects} icon="📁" color="indigo" />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon="📋" color="indigo" />
        <StatCard title="Completed" value={stats.completedTasks} icon="✅" color="emerald" />
        <StatCard title="In Progress" value={stats.inProgressTasks} icon="⏳" color="amber" />
        <StatCard title="Pending" value={stats.pendingTasks} icon="🕐" color="indigo" />
        <StatCard title="Overdue" value={stats.overdueTasks} icon="⚠️" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Left Column ---- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Projects */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                 <h2 className="text-xl font-bold text-slate-800">Active Projects</h2>
                 <p className="text-sm text-slate-500 mt-1">Track your ongoing initiatives</p>
              </div>
              <Link to="/projects" className="px-4 py-2 bg-slate-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50 transition-colors">
                View All
              </Link>
            </div>

            {projects.length === 0 ? (
              <EmptyState 
                 icon="📁" 
                 title="No active projects" 
                 description={isAdmin ? "Create your first project to get started." : "You haven't been added to any projects."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => {
                  const isOverdue = project.deadline && new Date(project.deadline) < today && project.progress < 100;
                  return (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="group block p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-100/50 transition-all bg-white"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                        {isOverdue ? <Badge label="Overdue" color="rose" /> : <Badge label={`${project.progress}%`} color={project.progress === 100 ? "emerald" : "indigo"} />}
                      </div>
                      <ProgressBar progress={project.progress || 0} size="sm" showLabel={false} />
                      <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
                         <span className="flex items-center gap-1">⏱️ {formatDate(project.deadline)}</span>
                         <span className="flex items-center gap-1">👥 {project.members?.length || 0}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Overdue Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl border border-rose-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-xl shadow-sm shadow-rose-200">⚠️</div>
                <div>
                   <h2 className="text-lg font-bold text-rose-800">Needs Attention</h2>
                   <p className="text-sm text-rose-600/80">You have {overdueTasks.length} overdue task(s)</p>
                </div>
              </div>
              <div className="space-y-3">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-rose-100/50 hover:bg-white transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate">Due: {formatDate(task.dueDate)} • {task.project?.title || "No project"}</p>
                    </div>
                    <Link to="/tasks" className="ml-4 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap shadow-sm">
                      View Task
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Right Column ---- */}
        <div className="space-y-8">
          
          {/* Task Completion Overview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Task Overview</h2>
            {tasks.length === 0 ? (
               <p className="text-sm text-slate-400 text-center py-4">No data available.</p>
            ) : (
               <>
                 <div className="mb-8">
                   <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                     <span>Overall Progress</span>
                     <span className="text-indigo-600">{Math.round((stats.completedTasks / stats.totalTasks) * 100)}%</span>
                   </div>
                   <ProgressBar progress={Math.round((stats.completedTasks / stats.totalTasks) * 100)} size="lg" showLabel={false} />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-100/50">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-slate-700">Completed</span>
                       </div>
                       <span className="font-bold text-emerald-700">{stats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-100/50">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium text-slate-700">In Progress</span>
                       </div>
                       <span className="font-bold text-amber-700">{stats.inProgressTasks}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                          <span className="text-sm font-medium text-slate-700">Pending</span>
                       </div>
                       <span className="font-bold text-slate-700">{stats.pendingTasks}</span>
                    </div>
                 </div>
               </>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            </div>

            {recentTasks.length === 0 ? (
               <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
            ) : (
               <div className="relative pl-3">
                 {/* Vertical line */}
                 <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-100" />
                 
                 <div className="space-y-6 relative">
                   {recentTasks.map((task) => (
                     <div key={task._id} className="flex gap-4">
                       <div className="relative z-10 mt-1">
                          <div className={`w-3 h-3 rounded-full border-2 border-white ${task.status === 'Completed' ? 'bg-emerald-500 shadow-emerald-200' : task.status === 'In Progress' ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-500 shadow-indigo-200'} shadow-sm`} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-slate-800 font-medium">Task updated</p>
                         <p className="text-sm text-slate-500 mt-0.5 truncate">{task.title}</p>
                         <div className="flex items-center gap-2 mt-1.5">
                            <Badge label={task.status} color={task.status === 'Completed' ? 'emerald' : task.status === 'In Progress' ? 'amber' : 'slate'} />
                            <span className="text-xs text-slate-400">• {formatDate(task.createdAt)}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
