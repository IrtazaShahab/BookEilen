const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 302;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
