// ============================================
// pages/Signup.jsx — Professional split-screen layout
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      return setError("Please fill in all fields");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await signup(name, email, password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* ---- Right: Branding Panel ---- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

        {/* Logo */}
        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-xl">Team Task Manager</span>
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6 text-right">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Start organizing <br /> your team today.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed ml-auto max-w-md">
            Join thousands of teams who use Team Task Manager to deliver projects on time.
          </p>
          
          <div className="flex justify-end pt-4">
             <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-indigo-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-indigo-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-indigo-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jude" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-800 flex items-center justify-center text-xs text-white font-medium">+1k</div>
             </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-right">
          <p className="text-indigo-200 text-sm">Free forever for teams of up to 5 members.</p>
        </div>
      </div>

      {/* ---- Left: Signup Form ---- */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-bold text-slate-800 text-lg">Team Task Manager</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Create an account</h2>
              <p className="text-slate-500 text-sm mt-1">Get started with your free workspace</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl mb-5">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">👤</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">✉️</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 ml-1">Must be at least 6 characters.</p>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Type (Role)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                     <span className="text-slate-400">🏢</span>
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="member">Team Member</option>
                    <option value="admin">Workspace Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Sign in instead →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
