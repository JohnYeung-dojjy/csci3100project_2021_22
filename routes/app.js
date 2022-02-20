const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.get('/', (req, res) => {
    // send the file 'index.html. in the folder of the current script
    res.sendFile(__dirname + '/login/login.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/game/game.html');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login/login.html');
})

const server = app.listen(3000);