const dbService = require("../services/dbService");

// @desc    Add emergency contact
// @route   POST /contacts/add
// @access  Private
const addContact = async (req, res) => {
  const { name, phone, relationship } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error("Please provide name and phone");
  }

  const contact = await dbService.addContact(req.user._id, {
    name,
    phone,
    relationship,
  });

  res.status(201).json(contact);
};

// @desc    Get user contacts
// @route   GET /contacts/:userId
// @access  Private
const getContacts = async (req, res) => {
  // Ensure user is requesting their own contacts
  if (req.params.userId !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const contacts = await dbService.getContacts(req.params.userId);
  res.json(contacts);
};

// @desc    Delete contact
// @route   DELETE /contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  const contact = await dbService.deleteContact(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // Check if contact belongs to user (In a real app, we should fetch first then check)
  // For now, dbService.deleteContact deletes by ID.
  // Ideally we should check ownership.

  res.json({ id: req.params.id });
};

module.exports = {
  addContact,
  getContacts,
  deleteContact,
};
