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

env.config({
    path: `./.env.${process.env.NODE_ENV || 'development'}`,
});

var app = express();

// CORS MUST BE FIRST - CRITICAL ORDER
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing - MUST be after CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Other middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Database test route
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM user');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handlers
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
