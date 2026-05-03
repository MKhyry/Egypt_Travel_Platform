const Hotel = require('../models/Hotel');

// GET /api/hotels
const getAllHotels = async (req, res) => {
  try {
    const { city, stars, maxPrice } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (stars) filter.stars = Number(stars);
    if (maxPrice) filter.pricePerNight = { $lte: Number(maxPrice) };

    const hotels = await Hotel.find(filter)
      .populate('nearbyPlaces', 'name city');

    res.json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hotels/:id
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('nearbyPlaces', 'name city images category');

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hotels/suggestions/:tripId
const getHotelSuggestions = async (req, res) => {
  try {
    const Trip = require('../models/Trip');

    const trip = await Trip.findById(req.params.tripId)
      .populate('places.place', 'city');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Extract unique cities from the trip's places
    const cities = [...new Set(trip.places.map((p) => p.place?.city).filter(Boolean))];

    // Find hotels in those cities
    const hotels = await Hotel.find({ city: { $in: cities } })
      .populate('nearbyPlaces', 'name city');

    res.json({ success: true, cities, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/hotels (admin only)
const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/hotels/:id (admin only)
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/hotels/:id (admin only)
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllHotels, getHotelById, getHotelSuggestions, createHotel, updateHotel, deleteHotel };