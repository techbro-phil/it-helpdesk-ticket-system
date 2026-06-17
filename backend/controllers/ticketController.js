const pool = require('../config/db');

// @desc    Create a new helpdesk ticket
// @route   POST /tickets
const createTicket = async (req, res) => {
  const { subject, description, category, priority } = req.body;

  // Simple validation to ensure required text exists
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
    
    // Send back the newly created ticket data with its auto-generated ID
    res.status(201).json({
      message: ' Ticket created successfully!',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error(' Error inserting ticket:', err.message);
    res.status(500).json({ error: 'Server error processing your ticket request.' });
  }
};

module.exports = {
  createTicket
};
