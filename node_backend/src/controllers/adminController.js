const dbService = require('../services/dbService');

// @desc    Get Admin Stats
// @route   GET /admin/stats
// @access  Public (or protected)
const getStats = async (req, res) => {
  const stats = await dbService.getAdminStats();
  res.json(stats);
};

module.exports = { getStats };
