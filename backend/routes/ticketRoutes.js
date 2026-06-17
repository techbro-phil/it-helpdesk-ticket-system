const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById } = require('../controllers/ticketController');

// Map methods to our controller functions
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById); // <-- Links GET /tickets/123 to our function

module.exports = router;
