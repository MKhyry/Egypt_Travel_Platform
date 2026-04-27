const express = require('express');
const router = express.Router();
const { getAllPlaces, getPlaceById } = require('../controllers/place.controller');

router.get('/', getAllPlaces);
router.get('/:id', getPlaceById);

module.exports = router;