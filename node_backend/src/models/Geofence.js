const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  polygon: [{
    lat: Number,
    lon: Number
  }],
  alertOnEnter: { type: Boolean, default: true },
  alertOnExit: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Geofence', geofenceSchema);
