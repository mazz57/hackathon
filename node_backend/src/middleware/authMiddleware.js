const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const dbService = require("../services/dbService");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, invalid token format");
      }

      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET not configured!");
        res.status(500);
        throw new Error("Server configuration error");
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        res.status(401);
        throw new Error("Not authorized, invalid token payload");
      }

      // Get user from the token
      req.user = await dbService.getUserById(decoded.id);

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error("🔒 Auth error:", error.message);

      // Handle specific JWT errors
      if (error.name === "JsonWebTokenError") {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      } else if (error.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Not authorized, token expired");
      }

      // Re-throw other errors
      throw error;
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

module.exports = { protect };
