const dbService = require("../services/dbService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Please provide all required fields: name, phone, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user exists
    const userExists = await dbService.getUserByPhone(phone);

    if (userExists) {
      return res.status(400).json({
        message: "User with this phone number already exists",
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await dbService.createUser({
      name,
      phone,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "Failed to create user. Please try again.",
      });
    }

    console.log(`✅ New user registered: ${user.phone}`);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        message: "Please provide phone and password",
      });
    }

    // Check for user
    const user = await dbService.getUserByPhone(phone);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log(`✅ User logged in: ${user.phone}`);

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
