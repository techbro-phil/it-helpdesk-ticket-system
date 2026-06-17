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
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    res.status(200).json(result.rows[0]); // Return the single ticket object directly
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
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error inserting ticket:', err.message);
    res.status(500).json({ error: 'Server error processing your ticket request.' });
  }
};

// @desc    Update an existing ticket's details/status
// @route   PUT /tickets/:id
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description, category, priority, status } = req.body;

    // 1. Check if the ticket exists first
    const checkTicket = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    // 2. Build our update text. If fields are omitted in the request body, keep the original database values!
    const updatedSubject = subject || checkTicket.rows[0].subject;
    const updatedDescription = description || checkTicket.rows[0].description;
    const updatedCategory = category || checkTicket.rows[0].category;
    const updatedPriority = priority || checkTicket.rows[0].priority;
    const updatedStatus = status || checkTicket.rows[0].status;

    const updateQuery = `
      UPDATE tickets 
      SET subject = $1, description = $2, category = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;
    const values = [updatedSubject, updatedDescription, updatedCategory, updatedPriority, updatedStatus, id];
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      message: ' Ticket updated successfully!',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error(' Error updating ticket:', err.message);
    res.status(500).json({ error: 'Server error updating ticket data.' });
  }
};

// CRITICAL: Export all four functions!
module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket
};
