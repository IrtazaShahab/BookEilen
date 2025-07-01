const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'book_eilen',
});

module.exports = {
    query: (text, params, callback) => pool.query(text, params, callback),
};
