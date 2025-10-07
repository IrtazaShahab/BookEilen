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

// Load env
env.config({
    path: `./.env.${process.env.NODE_ENV || 'development'}`,
});

var app = express();

/**
 * CORS Configuration
 * Updated to work with both local development and Vercel deployment
 */
const allowedOrigins = [
    'http://localhost:3020',                    // Local Next.js dev
    'http://localhost:3000',                    // Alternative local port
    'https://bookeilen.vercel.app',            // Your production frontend
    'https://bookeilen-frontend.vercel.app',   // Alternative frontend name
];

// Add all Vercel preview deployments
if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list or is a Vercel deployment
        if (allowedOrigins.indexOf(origin) !== -1 || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Other middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Health check route (root)
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "users" LIMIT 5');
        res.json({
            status: 'ok',
            message: 'Backend is running!',
            users: result.rows,
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// API Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/books', booksRouter);

// 404 handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    res.status(err.status || 500);
    
    // For API routes, send JSON instead of rendering
    if (req.path.startsWith('/api/')) {
        res.json({
            error: err.message,
            status: err.status || 500
        });
    } else {
        res.render('error');
    }
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3040;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;