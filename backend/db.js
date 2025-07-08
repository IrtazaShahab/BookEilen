const { Pool } = require('pg');
require('dotenv').config();

const { password, DATABASENAME } = process.env;


const pool = new Pool({
    user: 'postgres',
    password: password,
    host: 'localhost',
    port: 5432, // default Postgres port
    database: DATABASENAME,
});

module.exports = {
    query: (text, params, callback) => pool.query(text, params, callback),
};
