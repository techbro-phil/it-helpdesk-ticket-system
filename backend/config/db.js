const { Pool } = require('pg');
require('dotenv').config();

// Ensure the pool reads directly from your Neon.tech cloud connection string link
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This bypasses strict self-signed certificate constraints on hosted platforms
  }
});

module.exports = pool;
