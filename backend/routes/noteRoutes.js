const express = require('express');
const router = express.Router();
const { addNote, getNotesByTicket } = require('../controllers/noteController');
const { protect, technicianOrAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, technicianOrAdmin, addNote);                    // Only technician or admin can add notes
router.get('/ticket/:ticket_id', protect, getNotesByTicket);              // Any logged in user can view notes

module.exports = router;