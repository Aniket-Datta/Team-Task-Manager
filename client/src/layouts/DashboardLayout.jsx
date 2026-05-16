// ============================================
// layouts/DashboardLayout.jsx — Main layout with sidebar and navbar
// ============================================

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  // State to control mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar — fixed on desktop, toggleable on mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area — pushed right on desktop to make room for sidebar */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content — rendered by React Router's Outlet */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
