const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// @desc    Register a new user profile
// @route   POST /auth/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = 'user';

    const queryText = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role;
    `;
    const result = await pool.query(queryText, [name, email, hashedPassword, userRole]);
    res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error processing registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter email and password.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid authentication credentials.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid authentication credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error processing login authentication.' });
  }
};

// @desc    Get all users
// @route   GET /auth/users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving users:', err.message);
    res.status(500).json({ error: 'Server error retrieving corporate directories.' });
  }
};

// @desc    Update a user role
// @route   PUT /auth/users/:id/role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'technician', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid classification assignment.' });
  }

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} does not exist.` });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role;',
      [role, id]
    );

    res.status(200).json({ message: 'User role updated successfully!', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating role:', err.message);
    res.status(500).json({ error: 'Server error applying role configuration updates.' });
  }
};

// @desc    Send password reset email
// @route   POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please provide your email address.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (result.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const user = result.rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3;',
      [resetToken, resetExpires, user.id]
    );

    // Build reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"IT HelpDesk System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1E293B;">Password Reset Request</h2>
          <p style="color: #475569;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #475569;">You requested a password reset. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetURL}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #2563EB; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reset My Password
          </a>
          <p style="color: #94a3b8; font-size: 13px;">If you did not request this, ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Server error sending reset email.' });
  }
};

// @desc    Reset password using token
// @route   POST /auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  try {
    // Find user with valid token that hasn't expired
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW();',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
    }

    const user = result.rows[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2;',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  forgotPassword,
  resetPassword,
};