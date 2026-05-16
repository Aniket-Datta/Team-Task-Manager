// ============================================
// components/ui/LoadingSpinner.jsx
// ============================================
export const LoadingSpinner = ({ size = "md", color = "indigo" }) => {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-8 h-8 border-3", lg: "w-12 h-12 border-4" };
  return (
    <div className={`${sizes[size]} border-${color}-200 border-t-${color}-600 rounded-full animate-spin`} />
  );
};

// ============================================
// components/ui/Badge.jsx
// ============================================
export const Badge = ({ label, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
};

// ============================================
// components/ui/EmptyState.jsx
// ============================================
export const EmptyState = ({ icon = "📭", title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-slate-300">
    <span className="text-5xl mb-4">{icon}</span>
    <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-400 mb-4">{description}</p>}
    {action && action}
  </div>
);

// ============================================
// components/ui/PageLoader.jsx
// ============================================
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-24">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);

// ============================================
// components/ui/StatCard.jsx
// ============================================
export const StatCard = ({ title, value, icon, color = "indigo", sub }) => {
  const bg = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${bg[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
