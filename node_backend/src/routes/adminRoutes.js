const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/adminController");
const asyncHandler = require("express-async-handler");

router.get("/stats", asyncHandler(getStats));

module.exports = router;
