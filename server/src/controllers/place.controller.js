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

// POST /api/places (admin only)
const createPlace = async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/places/:id (admin only)
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/places/:id (admin only)
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllPlaces, getPlaceById, createPlace, updatePlace, deletePlace };