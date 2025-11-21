const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const asyncHandler = require('express-async-handler');

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

module.exports = router;
