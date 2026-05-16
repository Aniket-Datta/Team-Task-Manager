// ============================================
// components/ProjectCard.jsx — Polished Project card
// ============================================

import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { Badge } from "./ui";

const ProjectCard = ({ project }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.progress < 100;
  const isCompleted = project.progress === 100;

  return (
    <Link to={`/projects/${project._id}`} className="block h-full outline-none">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col focus:ring-4 focus:ring-indigo-100">
        
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex-1 min-w-0">
             <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
               {project.title}
             </h3>
             <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Updated {formatDate(project.updatedAt || project.createdAt)}
             </p>
          </div>
          <div className="flex-shrink-0">
             {isCompleted ? (
               <Badge label="Done" color="emerald" />
             ) : isOverdue ? (
               <Badge label="Overdue" color="rose" />
             ) : (
               <Badge label="Active" color="indigo" />
             )}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1">
          {project.description || "No description provided."}
        </p>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-semibold text-slate-700">Progress</span>
             <span className="text-xs font-bold text-indigo-600">{project.progress || 0}%</span>
          </div>
          <ProgressBar progress={project.progress || 0} size="sm" showLabel={false} />
        </div>

        <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-slate-400">⏱️</span>
            <span className={`font-medium ${isOverdue ? 'text-rose-500' : ''}`}>{formatDate(project.deadline)}</span>
          </div>
          
          <div className="flex -space-x-2">
             {/* Simple member avatars (circles with initials or generic avatars) */}
             {project.members && project.members.slice(0, 3).map((m, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700" title={m.name}>
                   {m.name?.charAt(0).toUpperCase()}
                </div>
             ))}
             {project.members?.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                   +{project.members.length - 3}
                </div>
             )}
             {(!project.members || project.members.length === 0) && (
                <div className="text-xs text-slate-400">0 members</div>
             )}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProjectCard;
