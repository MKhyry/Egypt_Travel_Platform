const Package = require('../models/Package');

// GET /api/packages — with filters
const getAllPackages = async (req, res) => {
  try {
    const { tier, region, duration } = req.query;
    const filter = {};

    if (tier) filter.tier = tier;

    if (region) {
      // regions is an array, so we check if it contains the region
      filter.regions = { $in: [region] };
    }

    if (duration) {
      if (duration === 'short') filter.days = { $lte: 5 };
      else if (duration === 'medium') filter.days = { $gte: 6, $lte: 9 };
      else if (duration === 'long') filter.days = { $gte: 10 };
    }

    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/packages/:id
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPackages, getPackageById };
