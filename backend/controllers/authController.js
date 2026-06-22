const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user profile
// @route   POST /auth/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  try {
    // 1. Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    // 2. Encrypt/Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Security Lockdown: Public registrations are strictly forced to 'user' tier status.
    const userRole = 'user';
    const queryText = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role;
    `;
    const result = await pool.query(queryText, [name, email, hashedPassword, userRole]);

    res.status(201).json({ message: '👤 User registered successfully!', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
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
    // 1. Check if the user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid authentication credentials.' });
    }

    const user = result.rows[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid authentication credentials.' });
    }

    // 3. Create and return a JSON Web Token signed with their role permissions
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 24 hours
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error processing login authentication.' });
  }
};

module.exports = { registerUser, loginUser };

// @desc    Get all registered corporate users
// @route   GET /auth/users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error retrieving users:', err.message);
    res.status(500).json({ error: 'Server error retrieving corporate directories.' });
  }
};

// @desc    Update a user's role assignment classification
// @route   PUT /auth/users/:id/role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate that the role matches our explicit system structures
  if (!['user', 'technician', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid classification assignment.' });
  }

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} does not exist.` });
    }

    const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role;';
    const result = await pool.query(updateQuery, [role, id]);

    res.status(200).json({
      message: '🔄 User operational clearance level upgraded successfully!',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error updating role:', err.message);
    res.status(500).json({ error: 'Server error applying role configuration updates.' });
  }
};

// CRITICAL: Update your export block at the bottom to include these new tools!
module.exports = {
  registerUser,
  loginUser,
  getAllUsers, // <-- Add this
  updateUserRole // <-- Add this
};
