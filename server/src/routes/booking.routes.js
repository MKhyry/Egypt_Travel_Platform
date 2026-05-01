const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema, bookingIdSchema } = require('../validationSchemas');
const { createBooking, getMyBookings, getBookingById } = require('../controllers/booking.controller');

// All booking routes are protected
router.use(protect);

router.post('/', validate(createBookingSchema), createBooking);
router.get('/my', getMyBookings);
router.get('/:id', validate(bookingIdSchema), getBookingById);

module.exports = router;
