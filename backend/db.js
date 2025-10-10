const { Pool } = require('pg');
require('dotenv').config();

// Extract variables from .env
const { DB_PORT, DB_NAME, DB_PASSWORD } = process.env;

const pool = new Pool({
  user: 'postgres', // or process.env.DB_USER if you add that to .env
  password: DB_PASSWORD,
  host: 'localhost',
  port: DB_PORT || 5432,
  database: DB_NAME,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
