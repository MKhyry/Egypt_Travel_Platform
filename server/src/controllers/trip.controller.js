const Trip = require('../models/Trip');

// POST /api/trips — Create a new trip
const createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, notes } = req.body;

    const trip = await Trip.create({
      user: req.user._id,
      title,
      startDate,
      endDate,
      notes,
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trips — Get all trips for logged-in user
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .populate('places.place', 'name city images')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trips/:id — Get one trip
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('places.place', 'name city images category visitDuration');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Make sure the trip belongs to the logged-in user
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/trips/:id/places — Add a place to a trip
const addPlaceToTrip = async (req, res) => {
  try {
    const { placeId, day } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Prevent duplicate places on the same day
    const alreadyAdded = trip.places.some(
      (p) => p.place.toString() === placeId && p.day === day
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: 'Place already added to this day'
      });
    }

    // Add place with order = number of places already on that day
    const placesOnDay = trip.places.filter((p) => p.day === day).length;
    trip.places.push({ place: placeId, day, order: placesOnDay });

    await trip.save();

    // Return populated trip
    await trip.populate('places.place', 'name city images category visitDuration');

    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/trips/:id/places/:placeId — Remove a place from a trip
const removePlaceFromTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    trip.places = trip.places.filter(
      (p) => p._id.toString() !== req.params.placeId
    );

    await trip.save();
    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/trips/:id — Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  getTripById,
  addPlaceToTrip,
  removePlaceFromTrip,
  deleteTrip,
};