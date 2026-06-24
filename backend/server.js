const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// CORS - Allow your Vercel frontend
const allowedOrigins = [
  'https://it-helpdesk-ticket-system-go9u.vercel.app',
  'https://it-helpdesk-ticket-system-go9u-git-master-tech-phil.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for testing
      // callback(new Error('Not allowed by CORS')); // Uncomment for production
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/notes', noteRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    database: 'Neon PostgreSQL',
    frontend: 'Vercel',
    timestamp: new Date().toISOString()
  });
});

// Database Initialization
const initDatabase = async () => {
  try {
    console.log(' Starting database initialization with Neon...');
    
    // Test database connection first
    const client = await pool.connect();
    console.log(' Neon database connection successful');
    client.release();

    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Users table verified/created');

    // 2. Create Tickets Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Open',
        user_id INT,
        assigned_to INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log(' Tickets table verified/created');

    // 3. Create Notes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT,
        note TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
    console.log(' Notes table verified/created');

    console.log(' All database tables verified and initialized successfully.');
  } catch (err) {
    console.error(' Error building database schemas:', err.message);
    console.error('Error details:', err);
  }
};

const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
  console.log(` Backend server running on port ${PORT}`);
  console.log(` Neon PostgreSQL connected`);
  console.log(` Frontend: Vercel`);
  
  // Initialize database after server starts
  setTimeout(async () => {
    await initDatabase();
  }, 3000);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});