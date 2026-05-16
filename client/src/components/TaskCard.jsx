// ============================================
// components/TaskCard.jsx — Task card for tasks page
// ============================================

const TaskCard = ({ task }) => {
  // Format due date
  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";

  // Priority badge colors
  const priorityColors = {
    High: "bg-rose-100 text-rose-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };

  // Status badge colors
  const statusColors = {
    Pending: "bg-slate-100 text-slate-600",
    "In Progress": "bg-indigo-100 text-indigo-600",
    Completed: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
      {/* Top row — title and priority */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-slate-800 line-clamp-1 flex-1 mr-2">
          {task.title}
        </h3>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 mb-3 line-clamp-2">
        {task.description || "No description."}
      </p>

      {/* Project name */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs">📁</span>
        <span className="text-xs text-slate-500 font-medium">
          {task.project?.title || "No project"}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
        {isOverdue && (
          <span className="px-2.5 py-1 text-xs font-medium bg-rose-100 text-rose-600 rounded-full">
            Overdue
          </span>
        )}
      </div>

      {/* Footer — assigned to and due date */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
            {task.assignedTo?.name?.charAt(0) || "?"}
          </div>
          <span>{task.assignedTo?.name || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span className={isOverdue ? "text-rose-500 font-medium" : ""}>
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
