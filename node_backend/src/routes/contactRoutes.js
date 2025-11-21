const express = require('express');
const router = express.Router();
const { addContact, getContacts, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/add', protect, asyncHandler(addContact));
router.get('/:userId', protect, asyncHandler(getContacts));
router.delete('/:id', protect, asyncHandler(deleteContact));

module.exports = router;
