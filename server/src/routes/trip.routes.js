const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createTrip,
  getMyTrips,
  getTripById,
  addPlaceToTrip,
  removePlaceFromTrip,
  deleteTrip,
} = require('../controllers/trip.controller');

// All trip routes are protected
router.use(protect);

router.post('/', createTrip);
router.get('/', getMyTrips);
router.get('/:id', getTripById);
router.post('/:id/places', addPlaceToTrip);
router.delete('/:id/places/:placeId', removePlaceFromTrip);
router.delete('/:id', deleteTrip);

module.exports = router;