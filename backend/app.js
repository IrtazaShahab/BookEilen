var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var env = require('dotenv');
const db = require('./db');

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

// Load env first
env.config({
    path: `./.env.${process.env.NODE_ENV || 'development'}`,
});

var app = express();

/**
 * CORS — MUST come before any route/middleware that may handle requests.
 * Don't send a naked 200 for OPTIONS — let cors() attach the headers.
 */
const corsOptions = {
    origin: 'http://localhost:3020',        // your Next.js dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,                      // ok if you plan to use cookies; harmless otherwise
    optionsSuccessStatus: 204,              // typical for preflight
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));      // handle all preflights WITH headers

// Body parsers (after CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Other middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Simple health/db test route (fix table name to "users" to match your code)
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "users" LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/books', booksRouter);

// Start server
// const PORT = process.env.PORT || 3040;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 404
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
