// ============================================
// context/AuthContext.jsx — Real authentication using backend APIs
// ============================================

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context anywhere in the app
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider — wraps the entire app
export const AuthProvider = ({ children }) => {
  // user: stores logged-in user object (name, email, role, etc.)
  const [user, setUser] = useState(null);

  // token: stores JWT token string
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // loading: true while checking if user is already logged in
  const [loading, setLoading] = useState(true);

  // ---- On app load: check if user is already logged in ----
  // If there's a token in localStorage, fetch the user from /auth/me
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        // No token found — user is not logged in
        setLoading(false);
        return;
      }

      try {
        // Call GET /api/auth/me using the saved token
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid or expired — clear everything
        console.error("Session expired:", error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUser();
  }, []);

  // ---- LOGIN function ----
  const login = async (email, password) => {
    // POST /api/auth/login
    const response = await api.post("/auth/login", { email, password });

    const { token: newToken, user: loggedInUser } = response.data;

    // Save token to localStorage (so it persists after page refresh)
    localStorage.setItem("token", newToken);

    // Update state
    setToken(newToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // ---- SIGNUP function ----
  const signup = async (name, email, password, role) => {
    // POST /api/auth/signup
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
      role,
    });

    const { token: newToken, user: newUser } = response.data;

    // Save token to localStorage
    localStorage.setItem("token", newToken);

    // Update state
    setToken(newToken);
    setUser(newUser);

    return newUser;
  };

  // ---- LOGOUT function ----
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setToken(null);
    setUser(null);
  };

  // Values available to all components via useAuth()
  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user, // true if user exists, false otherwise
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
