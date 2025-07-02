var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

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
    const dbNameResult = await db.query('SELECT current_database()');
    console.log('Connected to database:', dbNameResult.rows[0].current_database);
    // 3. Check for existing user (duplicate email)
    try {
        const existingUser = await db.query('SELECT * FROM user WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        // 4. Hash password before storing
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        // 5. Store user in DB (sanitize input is handled by parameterized queries)
        const result = await db.query('INSERT INTO user (f_name, l_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [
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

module.exports = router;
