const User = require("../models/User");
const Contact = require("../models/Contact");
const SOS = require("../models/SOS");
const Location = require("../models/Location");
const Geofence = require("../models/Geofence");
const Trip = require("../models/Trip");

// User Services
const createUser = async (userData) => {
  return await User.create(userData);
};

const getUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};

const getUserById = async (id) => {
  try {
    console.log("dbService.getUserById called with:", id);
    const user = await User.findById(id);
    console.log("dbService.getUserById result:", user ? user._id : "null");
    return user;
  } catch (error) {
    console.error("dbService.getUserById Error:", error);
    throw error;
  }
};

// Contact Services
const addContact = async (userId, contactData) => {
  return await Contact.create({ ...contactData, user: userId });
};

const getContacts = async (userId) => {
  return await Contact.find({ user: userId });
};

const updateContact = async (contactId, contactData) => {
  return await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
};

const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

// SOS Services
const saveSOS = async (sosData) => {
  return await SOS.create(sosData);
};

const getSOSHistory = async (userId) => {
  return await SOS.find({ user: userId }).sort({ createdAt: -1 });
};

// Location Services
const saveLocation = async (locationData) => {
  // Upsert location for the user
  return await Location.findOneAndUpdate(
    { user: locationData.user },
    locationData,
    { new: true, upsert: true }
  );
};

const getLatestLocation = async (userId) => {
  return await Location.findOne({ user: userId });
};

// Geofence Services
const createGeofence = async (geofenceData) => {
  return await Geofence.create(geofenceData);
};

const getGeofencesForUser = async (userId) => {
  return await Geofence.find({ user: userId });
};

const deleteGeofence = async (geofenceId) => {
  return await Geofence.findByIdAndDelete(geofenceId);
};

// Trip Services
const createTrip = async (tripData) => {
  return await Trip.create(tripData);
};

const getTrip = async (tripId) => {
  return await Trip.findById(tripId);
};

const updateTripStatus = async (tripId, status) => {
  return await Trip.findByIdAndUpdate(tripId, { status }, { new: true });
};

// Admin Services
const getAdminStats = async () => {
  const userCount = await User.countDocuments();
  const sosCount = await SOS.countDocuments();
  const tripCount = await Trip.countDocuments();
  return { userCount, sosCount, tripCount };
};

module.exports = {
  createUser,
  getUserByPhone,
  getUserById,
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  saveSOS,
  getSOSHistory,
  saveLocation,
  getLatestLocation,
  createGeofence,
  getGeofencesForUser,
  deleteGeofence,
  createTrip,
  getTrip,
  updateTripStatus,
  getAdminStats,
};
