const pool = require('../config/db');

// @desc    Get all helpdesk tickets
// @route   GET /tickets
const getTickets = async (req, res) => {
  try {
    // Run an SQL query to select all records from the tickets table ordered by newest first
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC;');
    
    // Return the array of tickets to the client
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err.message);
    res.status(500).json({ error: 'Server error retrieving tickets.' });
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

// CRITICAL: Make sure BOTH functions are exported here!
module.exports = {
  getTickets,
  createTicket
};
