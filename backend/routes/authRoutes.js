const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;