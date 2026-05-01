const express = require('express');
const router = express.Router();
const { getAllPackages, getPackageById } = require('../controllers/package.controller');
const validate = require('../middleware/validate.middleware');
const { getPackagesSchema, getPackageByIdSchema } = require('../validationSchemas');

router.get('/', validate(getPackagesSchema), getAllPackages);
router.get('/:id', validate(getPackageByIdSchema), getPackageById);

module.exports = router;
