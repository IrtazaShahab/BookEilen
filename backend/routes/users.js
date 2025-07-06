var express = require('express');
var router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// Signup
router.post('/signup', async (req, res) => {
    const { email, f_name, l_name, password, confirmPassword } = req.body;
    // 1. Validate all required fields
    if (!f_name || !l_name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // 2. Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }
    // 3. Check for existing user (duplicate email)
    try {
        const existingUser = await db.query('SELECT * FROM "user" WHERE "email" = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        // 4. Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        // 5. Store user in DB (sanitize input is handled by parameterized queries)
        const result = await db.query('INSERT INTO "user" (f_name, l_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [
            f_name,
            l_name,
            email,
            hashedPassword,
        ]);
        // 6. Return success (do not return password)
        const userData = { ...result.rows[0] };
        delete userData.password;

        res.status(201).json({
            message: 'User created successfully',
            data: userData,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', req.body);
    // 1. Validate all required fields
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // 2. Check for existing user (duplicate email)
    try {
        const existingUser = await db.query('SELECT * FROM "user" WHERE "email" = $1', [email]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // 3. Compare password with hashed password in DB
        const user = existingUser.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }
        // 4. Return success (do not return password)
        const userData = { ...user };
        delete userData.password;

        // TOKEN GENERATION
        const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken, // send token to frontend
            data: userData,
        });

        function authenticateToken(req, res, next) {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) return res.sendStatus(401); // Unauthorized
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) return res.sendStatus(403); // Forbidden
                req.user = user;
                next();
            });
        }
    } catch (error) {
        console.error('Error Logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
