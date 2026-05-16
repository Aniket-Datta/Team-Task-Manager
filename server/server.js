// ============================================
// server.js — Entry point for the Express server
// ============================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---- Global Middleware ----

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS so the React frontend can communicate with this API
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean); // removes undefined if CLIENT_URL is not set

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ---- Health Check Route ----
// Quick way to verify the server is running
app.get("/", (req, res) => {
  res.send("Team Task Manager API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// ---- API Routes ----
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// More routes will be added in later phases:
// app.use("/api/users", userRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// ---- 404 Handler — catch unknown routes ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
