const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createTripSchema,
  tripIdSchema,
  addPlaceToTripSchema,
  removePlaceFromTripSchema,
  addHotelToTripSchema,
} = require('../validationSchemas');
const {
  createTrip,
  getMyTrips,
  getTripById,
  addPlaceToTrip,
  removePlaceFromTrip,
  deleteTrip,
  addHotelToTrip,
} = require('../controllers/trip.controller');

// All trip routes are protected
router.use(protect);

router.post('/', validate(createTripSchema), createTrip);
router.get('/', getMyTrips);
router.get('/:id', validate(tripIdSchema), getTripById);
router.post('/:id/places', validate(addPlaceToTripSchema), addPlaceToTrip);
router.post('/:id/hotels', validate(addHotelToTripSchema), addHotelToTrip);
router.delete('/:id/places/:placeId', validate(removePlaceFromTripSchema), removePlaceFromTrip);
router.delete('/:id', validate(tripIdSchema), deleteTrip);

module.exports = router;