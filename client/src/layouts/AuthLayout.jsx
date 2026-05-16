// ============================================
// layouts/AuthLayout.jsx — Layout for login/signup pages
// ============================================

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  // Since Login and Signup pages now have their own full-screen split layouts,
  // this layout component just passes through the content.
  return (
    <div className="w-full min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
