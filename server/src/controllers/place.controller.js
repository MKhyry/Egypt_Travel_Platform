const Place = require('../models/Place');

// GET /api/places
const getAllPlaces = async (req, res) => {
  try {
    const { city, category } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (category) filter.category = category;

    const places = await Place.find(filter);
    res.json({ success: true, count: places.length, data: places });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPlaces, getPlaceById };