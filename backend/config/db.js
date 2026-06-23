const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Neon
  }
});

pool.on('connect', () => {
  console.log(' Neon PostgreSQL connected successfully!');
});

pool.on('error', (err) => {
  console.error(' Unexpected database error:', err);
});

// Test connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(' Neon Database connected at:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error(' Database connection test failed:', err.message);
    return false;
  }
};

testConnection();

module.exports = pool;