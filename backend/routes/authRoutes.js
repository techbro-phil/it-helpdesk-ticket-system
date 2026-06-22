const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUserRole } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);             // <-- Add this endpoint mapping
router.put('/users/:id/role', updateUserRole);  // <-- Add this endpoint mapping

module.exports = router;
