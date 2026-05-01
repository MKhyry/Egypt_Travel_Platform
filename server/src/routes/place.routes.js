const express = require('express');
const router = express.Router();
const { getAllPlaces, getPlaceById } = require('../controllers/place.controller');
const validate = require('../middleware/validate.middleware');
const { getPlacesSchema, getPlaceByIdSchema } = require('../validationSchemas');

router.get('/', validate(getPlacesSchema), getAllPlaces);
router.get('/:id', validate(getPlaceByIdSchema), getPlaceById);

module.exports = router;