const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const fs = require('fs');
const url = require('url');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const database = require('./models/testdb');
const system = require('./models/System_functions');
const mail = require('./models/mail');
const check = require('./models/cookiecheck');
const user = require('./models/User_functions');
const admin = require('./models/Admin_functions');
//middleware for the request content parsing 
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }));
app.use(bodyParser.json());
//middleware for setting cookie and session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true,
        maxAge: 3600 * 1000 * 24
    }
}));
//middleware for setting static file directory
app.use('/static', express.static(__dirname + '/public'));
//middleware for server-side files rendering
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//middleware for server storage for the user icon upload
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/uploads');
        },
        filename: function (req, file, cb) {
            let filename = req.session.username + file.originalname;
            cb(null, filename);
        }
    }),
    limits: { fieldSize: 10 * 1024 * 1024 }
}); //10MB



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


/* 
  routing functions are responsible for
  completing different actions and 
  directing the client to the specific page
*/

/*
 check cookie first
if cookie is correct, fill the template page with the username, email and icon in the cookie 
if no, the client will be redirected to the login page 
*/
app.get('/user', check.userneedlogin, async (req, res) => {
    let info = await user.displayInfo({ username: req.session.username });
    res.render('user.ejs', {
        thisusername: info.username,
        thisemail: info.user_email,
        thisicon: info.user_icon
    });
});


/*
 //check cookie first
//if cookie is correct,redirect the client to the corresponding pages (user/admin)
//if no, send the login page
 */
app.get('/', check.noneedlogin, (req, res) => {
    res.sendFile(__dirname + '/pages/login/login.html');
});

/* 
check cookie first
if cookie is correct,
use the username in the cookie to check the user's best score in the database and write them into the template page
if no, redirect the client to the login page
  */
app.get('/game', check.userneedlogin, async (req, res) => {
    let obj = { username: req.session.username };
    let score = 0;
    let userresult = await user.displayBestScore(obj);
    if (typeof userresult === "object") {
        score = userresult.score;
    }
    console.log("score in server is" + score);
    res.render('game.ejs', {
        thisusername: obj.username,
        thisscore: score
    })
});


/*
 check cookie first
if cookie is correct,
if yes, use the database function to load all the account information and leaderboard information,
and write them into the template page
if no, the client will be redirected to the login page 
*/
app.get('/admin', check.adminneedlogin, async (req, res) => {
    let leaderboard = await admin.displayLeaderboard();
    let allUsernameAndID = await admin.displayAllUser();
    res.render('admin.ejs', {
        thisleaderboard: leaderboard,
        thisallUsernameAndID: allUsernameAndID
    });
});

/* 
check the username and password with the records in the database so as to confirm the identity,
if the identity exists,write cookie into the client machine and redirect them into the corresponding pages
if no, load the error login page
 */

app.post('/loginverify', async (req, res) => {
    await system.loginAccount(req.body).then((content) => {
        console.log(content);
        if (content === 11100) {
            res.render('login.ejs', {
                errormessage: 'the username or password is wrong!',
                style: 'inset 0 3px 5px rgba(255, 0, 0, 0.5), 0 4px 0px rgba(255, 0, 0, 0.45)'
            })
        }
        else {
            check.cookiewrite(req, res, content);
            if (content.admin) {
                res.redirect('/admin');
            }
            else {
                res.redirect('/user');
            }
        }
    });
});

/* 
verify the data submmitted.
if ok,write the data into the database, 
write default icon into the database,send the confirmation email to the client
if no, send error message to the client
*/
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
                //console.log(content._id.toString());
                // let body = JSON.stringify({ code: code });
                let photo = {
                    data: fs.readFileSync(__dirname + '/public/img/Defaultuser.jpg'),
                    contentType: 'image/png'
                }
                await system.defaulticon(content, photo);
                await mail.mailing(content, 0);
                res.send({ code: content._id.toString() });//automatically change to json
            }
            else {
                console.log(content);
                res.send({ code: content });
            }

        })
    })

});

/* 
reset password for the user, send email for notification
*/
app.post('/adminresetpassword', async (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        await admin.resetPassword(obj).then(async (content) => {
            if (typeof content !== "number") {
                console.log(content);
                await mail.reset(content, 0);
                res.send({ code: content.username });//automatically change to json
            }
            else {
                res.send({ code: content });
            }

        })
    })

});

/* 
delete the user account
*/
app.post('/admindeleteaccount', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        await admin.deleteUseraccount(obj).then((content) => {
            res.send({ code: content });//automatically change to json
        })
    })

});

/* 
delete user's game record
*/
app.post('/admindeletegameplay', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        await admin.deleteGameplay(obj).then((content) => {
            res.send({ code: content });//automatically change to json
        })
    })

});


/*
update the leaderboard 
 */
app.post('/updateleaderboard', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        let content = await user.updateLeaderboard(obj);
        console.log(content.score);
        res.send(JSON.stringify(content));
    });

});


/*
load the leaderboard
 */
app.post('/getleaderboard', async (req, res) => {
    await admin.displayLeaderboard().then((content) => {
        res.send(JSON.stringify(content));
    });
});

/* 
clear cookie and logout, redirect to the login page
*/
app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

/* 
check the information the user uploaded,
write the database and then clear cookie and redirect the client to the login page
*/
app.post('/upload', upload.single('photo'), async (req, res) => {
    console.log(req.body);
    console.log(req.file)
    let photo;
    if (req.file) {
        photo = {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png'
        }
    }
    else {
        photo = '';
    }
    await user.updateInfo(req.body, photo).then((content) => {
        if (content === "duplicated") {
            res.send(content);
        }
        else {
            req.session.destroy();
            res.redirect('/');
        }
    });
});

/* 
allow user to change the password,log out,clear cookie and redirect to the login page
*/
app.post('/changepassword', async (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        await user.changepassword(obj);
        req.session.destroy();
        res.redirect('/');
    })

})

/* 
get all feedbacks
*/
app.post('/getfeedback', async (req, res) => {
    let content = await user.showFeedback();
    console.log(content);
    let result = JSON.stringify(content);
    res.send(result);
});

/* 
write feedbacks into the database
*/
app.post('/updatefeedback', async (req, res) => {
    console.log(req.body);
    let content = await user.updateFeedback(req.body);
    console.log(content);
    res.end();
});
const server = app.listen(3000);
module.exports = app;