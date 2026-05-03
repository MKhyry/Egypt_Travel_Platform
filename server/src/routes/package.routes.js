const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { admin: adminMiddleware } = require('../middleware/admin.middleware');
const validate = require('../middleware/validate.middleware');
const { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/package.controller');
const { getPackagesSchema, getPackageByIdSchema, createPackageSchema, updatePackageSchema } = require('../validationSchemas');

router.get('/', validate(getPackagesSchema), getAllPackages);
router.get('/:id', validate(getPackageByIdSchema), getPackageById);
router.post('/', protect, adminMiddleware, validate(createPackageSchema), createPackage);
router.put('/:id', protect, adminMiddleware, validate(updatePackageSchema), updatePackage);
router.delete('/:id', protect, adminMiddleware, validate(getPackageByIdSchema), deletePackage);

module.exports = router;
