// ============================================
// utils/dummyData.js — Placeholder data for UI development
// This will be replaced with real API data in later phases
// ============================================

// Dummy logged-in user
export const dummyUser = {
  _id: "user1",
  name: "John Doe",
  email: "john@example.com",
  role: "admin",
  createdAt: "2026-01-15T10:30:00Z",
};

// Dummy team members
export const dummyMembers = [
  { _id: "user1", name: "John Doe", email: "john@example.com", role: "admin" },
  { _id: "user2", name: "Jane Smith", email: "jane@example.com", role: "member" },
  { _id: "user3", name: "Alex Johnson", email: "alex@example.com", role: "member" },
  { _id: "user4", name: "Sara Wilson", email: "sara@example.com", role: "member" },
];

// Dummy projects
export const dummyProjects = [
  {
    _id: "proj1",
    title: "E-Commerce Platform",
    description: "Build a full-stack e-commerce website with payment integration and admin panel.",
    createdBy: { _id: "user1", name: "John Doe", email: "john@example.com" },
    members: [
      { _id: "user2", name: "Jane Smith" },
      { _id: "user3", name: "Alex Johnson" },
    ],
    deadline: "2026-08-15",
    progress: 65,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    _id: "proj2",
    title: "Mobile Banking App",
    description: "Design and develop a secure mobile banking application with real-time transactions.",
    createdBy: { _id: "user1", name: "John Doe", email: "john@example.com" },
    members: [
      { _id: "user3", name: "Alex Johnson" },
      { _id: "user4", name: "Sara Wilson" },
    ],
    deadline: "2026-09-30",
    progress: 30,
    createdAt: "2026-04-10T14:00:00Z",
  },
  {
    _id: "proj3",
    title: "HR Management System",
    description: "Internal tool for managing employee records, leave requests, and payroll.",
    createdBy: { _id: "user1", name: "John Doe", email: "john@example.com" },
    members: [
      { _id: "user2", name: "Jane Smith" },
      { _id: "user4", name: "Sara Wilson" },
    ],
    deadline: "2026-06-20",
    progress: 90,
    createdAt: "2026-02-15T09:00:00Z",
  },
  {
    _id: "proj4",
    title: "Social Media Dashboard",
    description: "Analytics dashboard for tracking social media engagement and campaign performance.",
    createdBy: { _id: "user1", name: "John Doe", email: "john@example.com" },
    members: [{ _id: "user2", name: "Jane Smith" }],
    deadline: "2026-07-10",
    progress: 15,
    createdAt: "2026-05-01T11:00:00Z",
  },
];

// Dummy tasks
export const dummyTasks = [
  {
    _id: "task1",
    title: "Design homepage wireframe",
    description: "Create low-fidelity wireframes for the homepage layout.",
    assignedTo: { _id: "user2", name: "Jane Smith", email: "jane@example.com" },
    project: { _id: "proj1", title: "E-Commerce Platform" },
    priority: "High",
    status: "Completed",
    dueDate: "2026-05-20",
    comments: [
      { _id: "c1", text: "Wireframe draft submitted for review.", createdBy: { name: "Jane Smith" }, createdAt: "2026-05-18T10:00:00Z" },
    ],
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    _id: "task2",
    title: "Implement payment gateway",
    description: "Integrate Stripe payment API for checkout process.",
    assignedTo: { _id: "user3", name: "Alex Johnson", email: "alex@example.com" },
    project: { _id: "proj1", title: "E-Commerce Platform" },
    priority: "High",
    status: "In Progress",
    dueDate: "2026-06-15",
    comments: [],
    createdAt: "2026-05-10T14:00:00Z",
  },
  {
    _id: "task3",
    title: "Set up user authentication",
    description: "Implement JWT-based login and signup for the banking app.",
    assignedTo: { _id: "user3", name: "Alex Johnson", email: "alex@example.com" },
    project: { _id: "proj2", title: "Mobile Banking App" },
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-06-01",
    comments: [],
    createdAt: "2026-05-05T08:00:00Z",
  },
  {
    _id: "task4",
    title: "Employee leave module",
    description: "Build leave request and approval workflow.",
    assignedTo: { _id: "user4", name: "Sara Wilson", email: "sara@example.com" },
    project: { _id: "proj3", title: "HR Management System" },
    priority: "Low",
    status: "Completed",
    dueDate: "2026-05-25",
    comments: [
      { _id: "c2", text: "Module completed and tested.", createdBy: { name: "Sara Wilson" }, createdAt: "2026-05-24T16:00:00Z" },
    ],
    createdAt: "2026-04-20T12:00:00Z",
  },
  {
    _id: "task5",
    title: "Database schema design",
    description: "Design MongoDB schemas for all collections.",
    assignedTo: { _id: "user2", name: "Jane Smith", email: "jane@example.com" },
    project: { _id: "proj2", title: "Mobile Banking App" },
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-05-10",
    comments: [],
    createdAt: "2026-04-28T09:00:00Z",
  },
  {
    _id: "task6",
    title: "Create analytics charts",
    description: "Build interactive charts for the social media dashboard.",
    assignedTo: { _id: "user2", name: "Jane Smith", email: "jane@example.com" },
    project: { _id: "proj4", title: "Social Media Dashboard" },
    priority: "High",
    status: "Pending",
    dueDate: "2026-04-30",
    comments: [],
    createdAt: "2026-04-15T10:00:00Z",
  },
];

// Dashboard statistics (calculated from dummy data)
export const dummyStats = {
  totalProjects: dummyProjects.length,
  totalTasks: dummyTasks.length,
  completedTasks: dummyTasks.filter((t) => t.status === "Completed").length,
  overdueTasks: dummyTasks.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "Completed"
  ).length,
  pendingTasks: dummyTasks.filter((t) => t.status === "Pending").length,
  inProgressTasks: dummyTasks.filter((t) => t.status === "In Progress").length,
};

// Recent activity feed
export const dummyActivity = [
  { _id: "a1", message: "Jane Smith completed 'Design homepage wireframe'", time: "2 hours ago", type: "completed" },
  { _id: "a2", message: "Alex Johnson started 'Implement payment gateway'", time: "5 hours ago", type: "started" },
  { _id: "a3", message: "John Doe created project 'Social Media Dashboard'", time: "1 day ago", type: "created" },
  { _id: "a4", message: "Sara Wilson completed 'Employee leave module'", time: "2 days ago", type: "completed" },
  { _id: "a5", message: "John Doe assigned task to Jane Smith", time: "3 days ago", type: "assigned" },
];
