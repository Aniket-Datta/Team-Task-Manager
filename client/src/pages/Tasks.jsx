// ============================================
// pages/Tasks.jsx — Polished Tasks Page
// ============================================

import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask, addTaskComment } from "../services/taskService";
import { PageLoader, EmptyState, Badge } from "../components/ui";

const statusColors = {
  Pending: "slate",
  "In Progress": "amber",
  Completed: "emerald",
};

const priorityColors = {
  High: "rose",
  Medium: "amber",
  Low: "emerald",
};

const Tasks = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const filters = ["All", "Pending", "In Progress", "Completed"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = activeFilter === "All" ? tasks : tasks.filter((t) => t.status === activeFilter);

  const handleCreateSubmit = async (formData) => {
    await createTask(formData);
    setShowForm(false);
    fetchTasks();
  };

  const handleEditSubmit = async (formData) => {
    await updateTask(editingTask._id, formData);
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatus(taskId);
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      if (selectedTask?._id === taskId) setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAddComment = async (taskId) => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const data = await addTaskComment(taskId, { text: commentText.trim() });
      setSelectedTask(data.task);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
      setCommentText("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) return <PageLoader message="Loading tasks..." />;

  return (
    <div className="space-y-6 pb-8">
      {/* ---- Page Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Task Board</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin ? `Managing ${tasks.length} total tasks across all projects` : `You have ${tasks.length} tasks assigned to you`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <span>+</span>
            <span>New Task</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="text-xl">⚠️</span><span className="font-medium">{error}</span></div>
          <button onClick={fetchTasks} className="px-4 py-2 bg-white text-rose-600 rounded-lg text-sm font-semibold shadow-sm hover:bg-rose-100">Retry</button>
        </div>
      )}

      {/* ---- Filter Tabs ---- */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border border-slate-100 w-fit shadow-sm">
        {filters.map((f) => {
           const count = f === "All" ? tasks.length : tasks.filter((t) => t.status === f).length;
           const isActive = activeFilter === f;
           return (
             <button
               key={f}
               onClick={() => setActiveFilter(f)}
               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                 isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-slate-50"
               }`}
             >
               {f}
               <span className={`px-2 py-0.5 rounded-lg text-xs ${isActive ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                 {count}
               </span>
             </button>
           );
        })}
      </div>

      {/* ---- Main Layout ---- */}
      <div className={`grid gap-6 ${selectedTask ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        
        {/* Task List */}
        <div className={selectedTask ? "lg:col-span-2 space-y-4" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"}>
          {filteredTasks.length === 0 ? (
            <EmptyState icon="📋" title="No tasks found" description={activeFilter !== "All" ? "No tasks match this filter." : isAdmin ? "Create your first task." : "You have no assigned tasks."} />
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
              const isSelected = selectedTask?._id === task._id;

              return (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(isSelected ? null : task)}
                  className={`bg-white rounded-3xl border p-5 cursor-pointer transition-all duration-300 ${
                    isSelected ? "border-indigo-400 ring-4 ring-indigo-50 shadow-md translate-x-2" : "border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge label={task.priority} color={priorityColors[task.priority]} />
                        <Badge label={task.status} color={statusColors[task.status]} />
                        {isOverdue && <Badge label="Overdue" color="rose" />}
                      </div>
                      <h3 className="text-base font-bold text-slate-800 line-clamp-2">{task.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 truncate">📁 {task.project?.title || "No project"}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch">
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-sm" title={task.assignedTo?.name}>
                         {task.assignedTo?.name?.charAt(0)?.toUpperCase() || "?"}
                       </div>
                       {isAdmin && (
                         <div className="flex items-center gap-1 mt-auto">
                           <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); setShowForm(true); }} className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors text-xs">✏️</button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }} className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-300 transition-colors text-xs">🗑️</button>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-medium text-slate-400">Update Status:</span>
                       <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl">
                         {["Pending", "In Progress", "Completed"].map((s) => {
                           const isActive = task.status === s;
                           return (
                             <button
                               key={s}
                               onClick={() => handleStatusChange(task._id, s)}
                               disabled={isActive || updatingStatus === task._id}
                               className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                 isActive ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent"
                               } disabled:opacity-50`}
                             >
                               {updatingStatus === task._id && !isActive ? "..." : s}
                             </button>
                           );
                         })}
                       </div>
                    </div>
                    <div className={`text-xs font-semibold flex items-center gap-1.5 ${isOverdue ? "text-rose-500" : "text-slate-400"}`}>
                       <span>⏱️</span>
                       <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Task Detail Panel */}
        {selectedTask && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/30 p-6 h-fit sticky top-24 flex flex-col max-h-[calc(100vh-120px)]">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex-1 min-w-0 pr-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Badge label={selectedTask.priority} color={priorityColors[selectedTask.priority]} />
                    <Badge label={selectedTask.status} color={statusColors[selectedTask.status]} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
               <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{selectedTask.description || "No description provided."}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                     <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Assigned To</p>
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">{selectedTask.assignedTo?.name?.charAt(0).toUpperCase()}</div>
                        <p className="font-semibold text-slate-800 text-sm truncate">{selectedTask.assignedTo?.name}</p>
                     </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                     <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Due Date</p>
                     <p className="font-semibold text-slate-800 text-sm">{formatDate(selectedTask.dueDate)}</p>
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                     <span>💬</span>
                     <span>Comments</span>
                     <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs">{selectedTask.comments?.length || 0}</span>
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    {selectedTask.comments?.length === 0 && (
                      <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                         <span className="text-2xl mb-2 block">💭</span>
                         <p className="text-xs text-slate-400">No comments yet. Start the conversation!</p>
                      </div>
                    )}
                    {selectedTask.comments?.map((comment, i) => (
                      <div key={i} className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                            {comment.createdBy?.name?.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-baseline justify-between mb-1">
                              <p className="text-xs font-bold text-slate-800">{comment.createdBy?.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute:"2-digit" })}
                              </p>
                           </div>
                           <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment(selectedTask._id)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400"
                />
                <button
                  onClick={() => handleAddComment(selectedTask._id)}
                  disabled={commentLoading || !commentText.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {commentLoading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleEditSubmit : handleCreateSubmit}
          onClose={() => { setShowForm(false); setEditingTask(null); }}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
