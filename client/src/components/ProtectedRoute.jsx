// ============================================
// components/ProtectedRoute.jsx — Route guard for authenticated users
// ============================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show a loading spinner while checking auth status (e.g., on page refresh)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user's role doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized — render the page
  return children;
};

export default ProtectedRoute;
