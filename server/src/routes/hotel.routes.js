const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin: adminMiddleware } = require('../middleware/admin.middleware');
const validate = require('../middleware/validate.middleware');
const {
  getHotelsSchema,
  getHotelByIdSchema,
  getHotelSuggestionsSchema,
  createHotelSchema,
  updateHotelSchema,
} = require('../validationSchemas');
const {
  getAllHotels,
  getHotelById,
  getHotelSuggestions,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotel.controller');

router.get('/', validate(getHotelsSchema), getAllHotels);
router.get('/:id', validate(getHotelByIdSchema), getHotelById);
router.get('/suggestions/:tripId', protect, validate(getHotelSuggestionsSchema), getHotelSuggestions);
router.post('/', protect, adminMiddleware, validate(createHotelSchema), createHotel);
router.put('/:id', protect, adminMiddleware, validate(updateHotelSchema), updateHotel);
router.delete('/:id', protect, adminMiddleware, validate(getHotelByIdSchema), deleteHotel);

module.exports = router;