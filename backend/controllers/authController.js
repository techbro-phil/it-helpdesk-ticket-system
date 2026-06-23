const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new corporate user
// @route   POST /auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    // 1. Check if the user already exists in the cloud registry
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // 2. Encrypt the password strings using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Force the registration parameter to standard 'user' clearance privileges
    const userRole = 'user';

    // 4. Insert into the database rows
    const insertQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role;
    `;
    const result = await pool.query(insertQuery, [name, email, hashedPassword, userRole]);

    res.status(201).json({
      message: 'Account created successfully.',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Registration error details:', err.message);
    res.status(500).json({ error: 'Server error creating user profile account.' });
  }
};
