const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

console.log(' Attempting database connection with config:', {
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port,
  user: dbConfig.user,
  ssl: dbConfig.ssl
});

const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log(' PostgreSQL connected successfully!');
});

pool.on('error', (err) => {
  console.error(' Unexpected error on idle client', err);
  process.exit(-1);
});

// Test query to verify connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(' Database time:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error(' Database connection test failed:', err.message);
    return false;
  }
};

// Run test on startup
testConnection();

module.exports = pool;