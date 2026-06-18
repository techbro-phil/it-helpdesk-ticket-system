const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes'); // <-- 1. Import your routes
require('dotenv').config();
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- Add this line


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Linking
app.use('/tickets', ticketRoutes); // <-- 2. Mount your tickets endpoint
app.use('/notes', noteRoutes);
app.use('/auth', authRoutes); // <-- 3. Mount your authentication endpoint

// Database Initialization Script
const initDatabase = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, -- <-- Make sure this line is added!
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      priority VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'Open',
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
      technician_id INT REFERENCES users(id) ON DELETE SET NULL,
      note TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTablesQuery);
    console.log(' Database tables verified & initialized successfully!');
  } catch (err) {
    console.error(' Error building database schemas:', err.message);
  }
};

// Start Runtime
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initDatabase();
});
