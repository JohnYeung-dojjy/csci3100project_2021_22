const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const url = require('url');
const path = require('path');
const ejs = require('ejs');
app.use('/static', express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '\\views');

/* 
try to understand the concept in this way:
Running the node.js,your computer become the server,not a user
if you access the web through http://localhost:3000/, you are a user 
'res.sendFile(__dirname + '/pages/login/login.html')' the content of html file in the server to user
the user computer become the compiler of this file, but the file is not at the user computer!!!
if 'login.html' file involve sth like <a href="./1234.jpeg">, 
then the user cannot even find the location of login.html as the file is only in the server but not user's machine
The pic cannot be loaded
The function above will pre-process the url in the file you send and give the user the access right to the server
if the url in file starts with 'static', it will be redirect to the __dirname+'public' in server.
So,all files can be seen by the user should be under the public
*/
/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/login/login.html');
}); */

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/pages/game/game.html');
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Homepage',
        users: ['BRIan', 'TOM', 'JErrY']
    });

})

const server = app.listen(3000);
