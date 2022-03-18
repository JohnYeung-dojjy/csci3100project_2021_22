const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/router');
const app = express();
app.use('*', router);

const server = app.listen(3000);
module.exports = app;