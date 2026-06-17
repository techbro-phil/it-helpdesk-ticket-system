const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/ticketController');

// Map the POST method to our controller function
router.post('/', createTicket);

// THIS LINE IS CRITICAL: It must export 'router' exactly like this!
module.exports = router;
