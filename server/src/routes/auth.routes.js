const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware'); // 👈 add this


router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;