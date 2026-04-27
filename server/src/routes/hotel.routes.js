const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAllHotels,
  getHotelById,
  getHotelSuggestions,
} = require('../controllers/hotel.controller');

router.get('/', getAllHotels);
router.get('/:id', getHotelById);
router.get('/suggestions/:tripId', protect, getHotelSuggestions);

module.exports = router;