const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticketController');

// Map methods to our controller functions
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket); // <-- Maps DELETE /tickets/123 to our function

module.exports = router;
