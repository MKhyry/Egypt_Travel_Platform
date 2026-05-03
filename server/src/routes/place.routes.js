const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const { admin: adminMiddleware } = require('../middleware/admin.middleware');
const validate = require('../middleware/validate.middleware');
const { getAllPlaces, getPlaceById, createPlace, updatePlace, deletePlace } = require('../controllers/place.controller');
const { getPlacesSchema, getPlaceByIdSchema, createPlaceSchema, updatePlaceSchema } = require('../validationSchemas');

router.get('/', validate(getPlacesSchema), getAllPlaces);
router.get('/:id', validate(getPlaceByIdSchema), getPlaceById);
router.post('/', protect, adminMiddleware, validate(createPlaceSchema), createPlace);
router.put('/:id', protect, adminMiddleware, validate(updatePlaceSchema), updatePlace);
router.delete('/:id', protect, adminMiddleware, validate(getPlaceByIdSchema), deletePlace);

module.exports = router;