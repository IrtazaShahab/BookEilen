var express = require('express');
var router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// quick guard to catch missing secrets early
if (!JWT_SECRET) {
    console.warn('⚠ JWT_SECRET is not set. Set it in your .env file.');
}

/* GET users listing. */
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

// Signup
router.post('/signup', async (req, res) => {
    const { email, f_name, l_name, password } = req.body;

    if (!f_name || !l_name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // check existing email
        const existingUser = await db.query(
            'SELECT * FROM "users" WHERE "email" = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert
        const result = await db.query(
            'INSERT INTO "users" (f_name, l_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [f_name, l_name, email, hashedPassword]
        );

        const user = { ...result.rows[0] };
        delete user.password;

        // token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN || '7d' }
        );

        return res.status(201).json({
            message: 'User created successfully',
            accessToken,
            data: user,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request received:', req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await db.query(
            'SELECT * FROM "users" WHERE "email" = $1',
            [email]
        );
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = existingUser.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const userData = { ...user };
        delete userData.password;

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN || '7d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            data: userData,
        });
    } catch (error) {
        console.error('Error Logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
