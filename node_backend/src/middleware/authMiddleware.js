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
    let decoded;
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      // Get user from the token
      req.user = await dbService.getUserById(decoded.id);
      console.log("User found:", req.user ? req.user._id : "null");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error(
        `Not authorized. Error: ${error.message}. Decoded: ${JSON.stringify(
          decoded || "undefined"
        )}`
      );
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
