const pool = require('../config/db');

// @desc    Add a note to a specific ticket
// @route   POST /notes
const addNote = async (req, res) => {
  const { ticket_id, note } = req.body;

  if (!ticket_id || !note) {
    return res.status(400).json({ error: 'Please provide ticket_id and note text.' });
  }

  try {
    const ticketCheck = await pool.query('SELECT * FROM tickets WHERE id = $1;', [ticket_id]);
    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({ error: `Cannot add note. Ticket ID ${ticket_id} does not exist.` });
    }

    const queryText = 'INSERT INTO notes (ticket_id, note) VALUES ($1, $2) RETURNING *;';
    const result = await pool.query(queryText, [ticket_id, note]);

    res.status(201).json({
      message: ' Note added successfully!',
      note: result.rows
    });
  } catch (err) {
    console.error(' Error adding note:', err.message);
    res.status(500).json({ error: 'Server error processing your note.' });
  }
};

// @desc    Get all notes for a specific ticket
// @route   GET /notes/ticket/:ticket_id
const getNotesByTicket = async (req, res) => {
  const { ticket_id } = req.params;

  try {
    const queryText = 'SELECT * FROM notes WHERE ticket_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(queryText, [ticket_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching notes:', err.message);
    res.status(500).json({ error: 'Server error retrieving notes.' });
  }
};

module.exports = {
  addNote,
  getNotesByTicket
};
