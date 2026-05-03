const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Trip = require('../models/Trip');

// POST /api/bookings — Create a new booking (supports both flows)
const createBooking = async (req, res) => {
  try {
    const { tripId, packageId, startDate, guests, contactName, contactEmail, contactPhone, notes } = req.body;
    let newTripId = null;

    let totalPrice = 0;

    // Validate ObjectIds
    if (tripId && !mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid tripId' });
    }
    if (packageId && !mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ success: false, message: 'Invalid packageId' });
    }

    // Flow 1: Custom trip booking
    if (tripId) {
      const trip = await Trip.findById(tripId).populate('hotels.hotel', 'pricePerNight');
      if (!trip) {
        return res.status(404).json({ success: false, message: 'Trip not found' });
      }
      if (trip.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      // Calculate price: sum of hotel costs for the trip
      (trip.hotels || []).forEach((h) => {
        if (h.hotel && h.hotel.pricePerNight) {
          totalPrice += h.hotel.pricePerNight * h.nights;
        }
      });
    }

    // Flow 2: Package booking
    if (packageId) {
      const pkg = await Package.findById(packageId);
      if (!pkg) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }
      totalPrice = (pkg.price || 0) * guests;

      // Auto-create a Trip for this package booking
      const tripStartDate = new Date(startDate);
      const tripEndDate = new Date(tripStartDate);
      tripEndDate.setDate(tripEndDate.getDate() + (pkg.days || 7));

      const trip = await Trip.create({
        user: req.user._id,
        title: pkg.title,
        startDate: tripStartDate,
        endDate: tripEndDate,
        status: 'confirmed',
      });

      newTripId = trip._id;
    }

    // Ensure totalPrice is a valid number
    if (isNaN(totalPrice) || totalPrice < 0) totalPrice = 0;

    const bookingData = {
      user: req.user._id,
      startDate,
      guests,
      totalPrice,
      contactName,
      contactEmail,
      contactPhone,
      notes,
    };
    if (tripId) bookingData.trip = tripId;
    if (packageId) bookingData.package = packageId;
    if (newTripId) bookingData.trip = newTripId;

    const booking = await Booking.create(bookingData);

    // Update trip status to 'confirmed' if this is a trip booking
    if (tripId) {
      await Trip.findByIdAndUpdate(tripId, { status: 'confirmed' });
    }

    // Populate using findById for reliability
    const populatedBooking = await Booking.findById(booking._id)
      .populate('trip', 'title startDate endDate')
      .populate('package', 'title duration price');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/bookings/my — Get current user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'title duration price image')
      .populate('trip', 'title startDate endDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/bookings/:id — Get single booking (only if owned by user)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package')
      .populate('trip');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById };
