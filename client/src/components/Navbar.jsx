// ============================================
// components/Navbar.jsx — Modern top navigation
// ============================================

import { useAuth } from "../context/AuthContext";

const Navbar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      {/* Left side: Mobile menu toggle & Search (desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search bar placeholder (Desktop only) */}
        <div className="hidden md:flex items-center relative">
          <span className="absolute left-3 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="pl-9 pr-4 py-2 w-64 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <span>🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-100 flex items-center justify-center shadow-sm">
            <span className="text-indigo-700 font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
