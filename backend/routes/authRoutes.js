const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter — max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;