const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, adminOnly, technicianOrAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);                        // Any logged in user can create
router.get('/', protect, getTickets);                          // Any logged in user can view
router.get('/:id', protect, getTicketById);                    // Any logged in user can view single
router.put('/:id', protect, technicianOrAdmin, updateTicket);  // Only technician or admin can update
router.delete('/:id', protect, adminOnly, deleteTicket);       // Only admin can delete

module.exports = router;