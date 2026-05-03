const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

// GET /api/search?q= — Search across places, hotels, and packages
const searchAll = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === '') {
      return res.json({ success: true, data: { places: [], hotels: [], packages: [] } });
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    // Search places
    const places = await Place.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { category: searchRegex },
      ],
    }).limit(20).select('name city category images rating description');

    // Search hotels
    const hotels = await Hotel.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
      ],
    }).limit(20).select('name city stars pricePerNight images description');

    // Search packages
    const packages = await Package.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { region: searchRegex },
        { tier: searchRegex },
      ],
    }).limit(20).select('title duration price image region tier description');

    res.json({
      success: true,
      data: {
        places: places.map(p => ({ ...p.toObject(), type: 'place' })),
        hotels: hotels.map(h => ({ ...h.toObject(), type: 'hotel' })),
        packages: packages.map(p => ({ ...p.toObject(), type: 'package' })),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { searchAll };
