var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', async (req, res) => {
    req.body;
    const newUser = {
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    console.log('New user data received:', newUser);

    // Save the newUser to your database
    res.status(200).json({
        message: 'Signup successful',
        data: newUser,
    });

    // Save the newUser to your database
    try {
        const result = await db.query('INSERT INTO user (f_name, l_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [
            newUser.f_name,
            newUser.l_name,
            newUser.email,
            newUser.password,
        ]);
        res.status(201).json({
            message: 'User created successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

module.exports = router;
