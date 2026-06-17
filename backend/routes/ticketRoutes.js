const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../controllers/ticketController'); // <-- Import getTickets

// Map methods to our controller functions
router.post('/', createTicket);
router.get('/', getTickets); // <-- Add this GET endpoint listener

module.exports = router;
