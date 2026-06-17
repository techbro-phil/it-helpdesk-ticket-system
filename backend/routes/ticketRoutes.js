const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket } = require('../controllers/ticketController');

// Map methods to our controller functions
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket); // <-- Maps PUT /tickets/123 to our update function

module.exports = router;
