const pool = require('../config/db');

// @desc    Get all helpdesk tickets
// @route   GET /tickets
const getTickets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC;');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err.message);
    res.status(500).json({ error: 'Server error retrieving tickets.' });
  }
};

// @desc    Get a single ticket by ID
// @route   GET /tickets/:id
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params; // <-- This grabs the ID number right out of the URL path!

    const result = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);

    // If the database returns 0 rows, it means that ticket ID doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    res.status(200).json(result.rows[0]); // Return just the single ticket object
  } catch (err) {
    console.error('❌ Error fetching ticket by ID:', err.message);
    res.status(500).json({ error: 'Server error retrieving ticket details.' });
  }
};

// @desc    Create a new helpdesk ticket
// @route   POST /tickets
const createTicket = async (req, res) => {
  const { subject, description, category, priority } = req.body;

  if (!subject || !description || !category || !priority) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    const queryText = `
      INSERT INTO tickets (subject, description, category, priority, status)
      VALUES ($1, $2, $3, $4, 'Open')
      RETURNING *;
    `;
    const values = [subject, description, category, priority];
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: '🎉 Ticket created successfully!',
      ticket: result.rows
    });
  } catch (err) {
    console.error('❌ Error inserting ticket:', err.message);
    res.status(500).json({ error: 'Server error processing your ticket request.' });
  }
};

// CRITICAL: Export all three functions!
module.exports = {
  getTickets,
  getTicketById,
  createTicket
};
