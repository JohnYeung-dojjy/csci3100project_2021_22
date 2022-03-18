const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

const server = app.listen(3000);
module.exports = app;