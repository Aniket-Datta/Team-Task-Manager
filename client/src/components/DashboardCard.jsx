// ============================================
// components/DashboardCard.jsx — Stat card for dashboard
// ============================================

const DashboardCard = ({ title, value, icon, color = "indigo", trend }) => {
  // Color variants for the card accent and icon background
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const iconBgClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        {/* Left side — title and value */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className="text-xs text-slate-400 mt-1">{trend}</p>
          )}
        </div>

        {/* Right side — icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClasses[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
