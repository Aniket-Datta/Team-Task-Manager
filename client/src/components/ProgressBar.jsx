// ============================================
// components/ProgressBar.jsx — Reusable progress bar component
// ============================================

const ProgressBar = ({ progress = 0, size = "md", showLabel = true }) => {
  // Determine bar height based on size prop
  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }[size] || "h-2.5";

  // Determine color based on progress value
  const getColor = () => {
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 40) return "bg-indigo-500";
    if (progress >= 20) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${getColor()} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
