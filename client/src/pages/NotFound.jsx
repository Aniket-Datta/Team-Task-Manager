// ============================================
// pages/NotFound.jsx — 404 page
// ============================================

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-indigo-200 mb-2">404</p>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="inline-flex px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
