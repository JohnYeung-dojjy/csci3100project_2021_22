const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('login.html');
})
const server = app.listen(3000);
module.exports = app;