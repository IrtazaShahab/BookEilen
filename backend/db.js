const { Pool } = require('pg');
require('dotenv').config();

const { password, DATABASENAME } = process.env;

const pool = new Pool({
    user: 'postgres',
    password: password,
    host: 'localhost',
    port: 5432,
    database: DATABASENAME,
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
