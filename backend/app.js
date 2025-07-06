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

// Connect to the database
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM user');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Define CORS options (customize as needed)
const corsOptions = {
    origin: '*', // Whitelist allowed origins
    methods: 'GET,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow sending cookies/auth headers
};

// Use the cors middleware with your options
app.use(cors(corsOptions));

// var port = process.env.PORT || '3040';
// app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
