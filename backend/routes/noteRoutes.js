const express = require('express');
const router = express.Router();
const { addNote, getNotesByTicket } = require('../controllers/noteController');

router.post('/', addNote);
router.get('/ticket/:ticket_id', getNotesByTicket);

module.exports = router;
