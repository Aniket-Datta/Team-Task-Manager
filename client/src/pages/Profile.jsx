// ============================================
// pages/Profile.jsx — Polished Profile Page
// ============================================

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Recently";

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 relative">
           <div className="absolute inset-0 bg-white/10 pattern-dots" />
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
           {/* Avatar */}
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
                 <p className="text-xs text-slate-400 mt-2">
                    Joined {joinDate}
                 </p>
              </div>
           </div>

           <hr className="my-8 border-slate-100" />

           {/* Account Details Form (Read Only for now) */}
           <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                       type="text" 
                       value={user?.name || ""} 
                       readOnly 
                       className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none" 
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                       type="email" 
                       value={user?.email || ""} 
                       readOnly 
                       className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none" 
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
              
              <div className="mt-8 flex justify-end">
                 <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm opacity-50 cursor-not-allowed" disabled>
                    Save Changes
                 </button>
                 <p className="text-xs text-slate-400 mt-3 absolute right-8">Profile editing coming soon.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
