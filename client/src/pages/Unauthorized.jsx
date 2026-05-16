// ============================================
// pages/Unauthorized.jsx — 403 Access Denied page
// ============================================

import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-6">You don't have permission to view this page.</p>
        <Link to="/dashboard" className="inline-flex px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
