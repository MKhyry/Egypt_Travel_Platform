const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validationSchemas');


router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected route
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;