const dbService = require("../services/dbService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  const userExists = await dbService.getUserByPhone(phone);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Ensure dbService.createUser triggers pre-save hook
  const user = await dbService.createUser({
    name,
    phone,
    password,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  // Check for user email
  const user = await dbService.getUserByPhone(phone);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};

module.exports = {
  registerUser,
  loginUser,
};
