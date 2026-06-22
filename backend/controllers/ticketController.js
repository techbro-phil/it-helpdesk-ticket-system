const pool = require('../config/db');

// @desc    Get helpdesk tickets (Filtered by permission role)
// @route   GET /tickets
const getTickets = async (req, res) => {
  const { user_id, role } = req.query; 

  try {
    let result;

    if (role === 'technician' || role === 'admin') {
      // Technicians and Administrators fetch the complete global corporate queue
      result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC;');
    } else {
      // Standard Users are strictly isolated to queries matching their personal user_id
      if (!user_id) {
        return res.status(400).json({ error: 'User identifier required to fetch data.' });
      }
      result = await pool.query('SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC;', [user_id]);
    }
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tickets:', err.message);
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

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching ticket by ID:', err.message);
    res.status(500).json({ error: 'Server error retrieving ticket details.' });
  }
};

// @desc    Create a new helpdesk ticket
// @route   POST /tickets
const createTicket = async (req, res) => {
  const { subject, description, category, priority, user_id } = req.body;

  if (!subject || !description || !category || !priority) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    const queryText = `
      INSERT INTO tickets (subject, description, category, priority, status, user_id)
      VALUES ($1, $2, $3, $4, 'Open', $5)
      RETURNING *;
    `;
    const values = [subject, description, category, priority, user_id || null];
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'Ticket created successfully.',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error('Error inserting ticket:', err.message);
    res.status(500).json({ error: 'Server error processing your ticket request.' });
  }
};

// @desc    Update ticket parameters or reassign ownership
// @route   PUT /tickets/:id
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description, category, priority, status, assigned_to } = req.body;

    // 1. Verify target ticket exists
    const checkTicket = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    // 2. Coalesce values: use incoming body payload values or fall back onto database defaults
    const updatedSubject = subject || checkTicket.rows[0].subject;
    const updatedDescription = description || checkTicket.rows[0].description;
    const updatedCategory = category || checkTicket.rows[0].category;
    const updatedPriority = priority || checkTicket.rows[0].priority;
    const updatedStatus = status || checkTicket.rows[0].status;
    const updatedAssigned = assigned_to !== undefined ? assigned_to : checkTicket.rows[0].assigned_to;

    const updateQuery = `
      UPDATE tickets 
      SET subject = $1, description = $2, category = $3, priority = $4, status = $5, assigned_to = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;
    const values = [updatedSubject, updatedDescription, updatedCategory, updatedPriority, updatedStatus, updatedAssigned, id];
    const result = await pool.query(updateQuery, values);

    // 3. SEAMLESS ENHANCEMENT: If status or assignment changed, inject a system automation history note
    if (status || assigned_to) {
      let logMessage = "System Log: Case files modified.";
      if (status && assigned_to) {
        logMessage = `System Log: Ticket ownership assigned and status escalated to ${status}.`;
      } else if (status) {
        logMessage = `System Log: Case progress tracking adjusted to ${status}.`;
      }
      
      await pool.query('INSERT INTO notes (ticket_id, note) VALUES ($1, $2);', [id, logMessage]);
    }

    res.status(200).json({
      message: 'Ticket updated successfully.',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating ticket parameters:', err.message);
    res.status(500).json({ error: 'Server error updating ticket data.' });
  }
};

// @desc    Delete a ticket permanently (System Admin Permission Only)
// @route   DELETE /tickets/:id
const deleteTicket = async (req, res) => {
  // Grab the request query context metadata to protect against unauthorized API requests
  const { role } = req.query;

  // STRICT ACCESS CONTROL SECURITY GATEWAY
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required to execute data purges.' });
  }

  try {
    const { id } = req.params;

    const checkTicket = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    await pool.query('DELETE FROM tickets WHERE id = $1;', [id]);

    res.status(200).json({ message: `Ticket with ID ${id} has been permanently deleted.` });
  } catch (err) {
    console.error('Error deleting ticket:', err.message);
    res.status(500).json({ error: 'Server error executing data deletion.' });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};
