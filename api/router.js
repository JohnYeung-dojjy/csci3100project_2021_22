const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const url = require('url');
const path = require('path');
const ejs = require('ejs');
const database = require('./models/testdb');
const system = require('./models/System_functions');
const mail = require('./models/mail');
const { builtinModules } = require('module');
/* const { getMaxListeners } = require('process'); */
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/login/login.html');
})

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/pages/game/game.html');
})


/* app.get('/sample', (req, res) => {
    res.render('sample.ejs', {
        title: 'Homepage',
        users: ['BRIan', 'TOM', 'JErrY']
    });

}) */

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + './pages/admin/admin.html');
})

app.post('/loginverify', async (req, res) => {
    /* console.log(req.body.username);//req.body is already a object */
    await system.loginAccount(req.body).then((content) => {
        console.log(content);
        if (content === 11100) {
            res.render('login.ejs', {
                errormessage: 'the username or password is wrong!',
                style: 'inset 0 3px 5px rgba(255, 0, 0, 0.5), 0 4px 0px rgba(255, 0, 0, 0.45)'
            })
        }
        else {
            /* res.render('admin.ejs',{
               username: content._id.toString(),
               email:content.email.toString(),
            }) */
            res.redirect('/admin');
        }
    });

})


app.post('/regverify', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        //need content._doc._id.toString() to show id, for other info,content._doc.username is ok
        obj = JSON.parse(data);//from json to object
        /* console.log(data); */
        await system.registerNewAccount(obj).then(async (content) => {
            if (typeof content !== "number") {
                console.log(content._doc._id.toString());
                /* let body = JSON.stringify({ code: code }); */
                await mail.mailing(content._doc, 0);
                res.send({ code: content._doc._id.toString() });//automatically change to json

            }
            else {
                res.send({ code: content });
            }
        })
    })

})

module.exports = app;