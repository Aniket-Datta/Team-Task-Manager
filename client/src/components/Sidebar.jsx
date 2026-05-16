// ============================================
// components/Sidebar.jsx — Modern professional sidebar
// ============================================

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/projects", label: "Projects", icon: "📁" },
    { to: "/tasks", label: "Tasks", icon: "✅" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-300 flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">TaskManager</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className={`text-lg transition-transform duration-200 group-hover:scale-110`}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Profile / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center border-2 border-slate-800 flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-indigo-400 font-medium capitalize truncate">{user?.role || "member"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
          >
            <span className="text-lg">🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
