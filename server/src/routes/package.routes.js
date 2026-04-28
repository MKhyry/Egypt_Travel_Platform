const express = require('express');
const router = express.Router();
const { getAllPackages, getPackageById } = require('../controllers/package.controller');

router.get('/', getAllPackages);
router.get('/:id', getPackageById);

module.exports = router;
