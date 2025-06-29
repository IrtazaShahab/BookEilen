var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', async (req, res) => {
    req.body;
    console.log('Received signup data:', req.body);

    res.status(200).json({
        message: 'Signup successful',
        // data: req.body,
    });
});

module.exports = router;
