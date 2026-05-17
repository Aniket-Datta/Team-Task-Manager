import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Recently";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (name === user?.name && email === user?.email) {
      setMessage({ type: "info", text: "No changes to save" });
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/auth/profile", { name, email });
      setUser(response.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 relative">
          <div className="absolute inset-0 bg-white/10 pattern-dots" />
        </div>

        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center absolute -top-12 shadow-md">
            <span className="text-3xl font-bold text-indigo-700">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="pt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <span>✉️</span> {user?.email}
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100">
                {user?.role}
              </span>
              <p className="text-xs text-slate-400 mt-2">Joined {joinDate}</p>
            </div>
          </div>

          <hr className="my-8 border-slate-100" />

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account Role</label>
                <input
                  type="text"
                  value={user?.role || "Member"}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none capitalize"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                <input
                  type="text"
                  value="UTC (Default)"
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 text-slate-400 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>
            </div>

            {message && (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" :
                message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" :
                "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {message.text}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
