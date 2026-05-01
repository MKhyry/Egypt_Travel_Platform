const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  getHotelsSchema,
  getHotelByIdSchema,
  getHotelSuggestionsSchema,
} = require('../validationSchemas');
const {
  getAllHotels,
  getHotelById,
  getHotelSuggestions,
} = require('../controllers/hotel.controller');

router.get('/', validate(getHotelsSchema), getAllHotels);
router.get('/:id', validate(getHotelByIdSchema), getHotelById);
router.get('/suggestions/:tripId', protect, validate(getHotelSuggestionsSchema), getHotelSuggestions);

module.exports = router;