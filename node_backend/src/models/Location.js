const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now }
});

// Index for geospatial queries if needed later
locationSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('Location', locationSchema);
