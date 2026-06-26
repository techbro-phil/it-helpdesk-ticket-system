const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Send ticket status notification email
const sendStatusEmail = async (toEmail, userName, ticket, newStatus) => {
  const statusColors = {
    'In Progress': '#f59e0b',
    'Resolved': '#22c55e',
    'Open': '#2563EB',
  };

  const color = statusColors[newStatus] || '#2563EB';

  try {
    await transporter.sendMail({
      from: `"IT HelpDesk System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Ticket #${ticket.id} Status Update — ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1E293B; margin-bottom: 4px;">Ticket Status Update</h2>
          <p style="color: #475569;">Hello <strong>${userName}</strong>,</p>
          <p style="color: #475569;">Your support ticket has been updated.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: bold; text-transform: uppercase;">Ticket Details</p>
            <p style="margin: 0 0 6px 0; color: #1E293B;"><strong>Ticket ID:</strong> #${ticket.id}</p>
            <p style="margin: 0 0 6px 0; color: #1E293B;"><strong>Subject:</strong> ${ticket.subject}</p>
            <p style="margin: 0 0 6px 0; color: #1E293B;"><strong>Category:</strong> ${ticket.category}</p>
            <p style="margin: 0 0 6px 0; color: #1E293B;"><strong>Priority:</strong> ${ticket.priority}</p>
            <p style="margin: 0; color: #1E293B;">
              <strong>New Status:</strong> 
              <span style="display: inline-block; padding: 2px 10px; border-radius: 6px; background-color: ${color}20; color: ${color}; font-weight: bold; border: 1px solid ${color};">
                ${newStatus}
              </span>
            </p>
          </div>

          ${newStatus === 'In Progress' ? `
            <p style="color: #475569;">A technician has claimed your ticket and is actively working on it. You will be notified again once it is resolved.</p>
          ` : newStatus === 'Resolved' ? `
            <p style="color: #475569;">Your ticket has been marked as resolved. If your issue persists, please file a new support ticket.</p>
          ` : ''}

          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #2563EB; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View Your Tickets
          </a>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            This is an automated message from the IT HelpDesk System. Please do not reply to this email.
          </p>
        </div>
      `,
    });
    console.log(` Status email sent to ${toEmail} for ticket #${ticket.id}`);
  } catch (err) {
    console.error(' Failed to send status email:', err.message);
    // Don't throw — email failure shouldn't break the ticket update
  }
};

// @desc    Get helpdesk tickets (Filtered by permission role)
// @route   GET /tickets
const getTickets = async (req, res) => {
  const { user_id, role } = req.query;

  try {
    let result;
    if (role === 'technician' || role === 'admin') {
      result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC;');
    } else {
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

    const oldTicket = checkTicket.rows[0];

    // 2. Coalesce values
    const updatedSubject = subject || oldTicket.subject;
    const updatedDescription = description || oldTicket.description;
    const updatedCategory = category || oldTicket.category;
    const updatedPriority = priority || oldTicket.priority;
    const updatedStatus = status || oldTicket.status;
    const updatedAssigned = assigned_to !== undefined ? assigned_to : oldTicket.assigned_to;

    const updateQuery = `
      UPDATE tickets 
      SET subject = $1, description = $2, category = $3, priority = $4, status = $5, assigned_to = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;
    const values = [updatedSubject, updatedDescription, updatedCategory, updatedPriority, updatedStatus, updatedAssigned, id];
    const result = await pool.query(updateQuery, values);
    const updatedTicket = result.rows[0];

    // 3. Auto log system note
    if (status || assigned_to) {
      let logMessage = 'System Log: Case files modified.';
      if (status && assigned_to) {
        logMessage = `System Log: Ticket ownership assigned and status escalated to ${status}.`;
      } else if (status) {
        logMessage = `System Log: Case progress tracking adjusted to ${status}.`;
      }
      await pool.query('INSERT INTO notes (ticket_id, note) VALUES ($1, $2);', [id, logMessage]);
    }

    // 4. Send email notification if status changed
    const statusChanged = status && status !== oldTicket.status;
    if (statusChanged && oldTicket.user_id) {
      // Fetch the ticket owner's email and name
      const userResult = await pool.query(
        'SELECT name, email FROM users WHERE id = $1;',
        [oldTicket.user_id]
      );

      if (userResult.rows.length > 0) {
        const { name, email } = userResult.rows[0];
        // Send email in background — don't await so it doesn't slow down the response
        sendStatusEmail(email, name, updatedTicket, status);
      }
    }

    res.status(200).json({
      message: 'Ticket updated successfully.',
      ticket: updatedTicket
    });
  } catch (err) {
    console.error('Error updating ticket parameters:', err.message);
    res.status(500).json({ error: 'Server error updating ticket data.' });
  }
};

// @desc    Delete a ticket permanently (Admin Only)
// @route   DELETE /tickets/:id
const deleteTicket = async (req, res) => {
  const { role } = req.query;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  try {
    const { id } = req.params;
    const checkTicket = await pool.query('SELECT * FROM tickets WHERE id = $1;', [id]);
    if (checkTicket.rows.length === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} was not found.` });
    }

    await pool.query('DELETE FROM tickets WHERE id = $1;', [id]);
    res.status(200).json({ message: `Ticket #${id} has been permanently deleted.` });
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