// ============================================
// controllers/authController.js — Auth business logic
// ============================================

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { signupSchema, loginSchema, updateProfileSchema } = require("../validations/authValidation");

// ---- SIGNUP ----
// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    // Step 1: Validate request body using Zod
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      // Extract the first validation error message
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { name, email, password, role } = validationResult.data;

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Step 3: Hash the password (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: Create new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "member", // Default to "member" if not provided
    });

    // Step 5: Generate JWT token
    const token = generateToken(user._id);

    // Step 6: Return user data (without password) and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ---- LOGIN ----
// POST /api/auth/login
const login = async (req, res) => {
  try {
    // Step 1: Validate request body using Zod
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { email, password } = validationResult.data;

    // Step 2: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 3: Compare password with hashed password in DB
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 4: Generate JWT token
    const token = generateToken(user._id);

    // Step 5: Return user data (without password) and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ---- GET ME ----
// GET /api/auth/me (Protected route)
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware (full user object from DB)
    // Since the middleware already excludes password, we can return req.user directly
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- UPDATE PROFILE ----
// PUT /api/auth/profile (Protected)
const updateProfile = async (req, res) => {
  try {
    const validationResult = updateProfileSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { name, email } = validationResult.data;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

module.exports = { signup, login, getMe, updateProfile };
