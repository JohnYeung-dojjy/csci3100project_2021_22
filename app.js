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
/* const { getMaxListeners } = require('process'); */
//cookie,session format setting
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: false,
        maxAge: 3600 * 1000 * 24
    }
}));


app.use('/static', express.static(__dirname + '/public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

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

// app.get('/home', (req, res) => {
//     res.sendFile(__dirname + '/pages/home/home.html');
// });

app.get('/user', check.userneedlogin, async (req, res) => {
    let info = await user.displayInfo({ username: req.session.username });
    if (info.user_icon === null || info.user_icon === '') {
        res.render('user.ejs', {
            thisusername: info.username,
            thisemail: info.user_email
        });
    }
    else {
        res.render('user.ejs', {
            thisusername: info.username,
            thisemail: info.user_email,
            thisicon: info.user_icon
        })
    }
});

app.get('/', check.noneedlogin, (req, res) => {
    res.sendFile(__dirname + '/pages/login/login.html');
});

app.get('/game', check.userneedlogin, async (req, res) => {
    let obj = { username: req.session.username };
    let score = 0;
    let userresult = await user.displayBestScore(obj);
    if (typeof userresult === "object") {
        score = userresult.score;
    }
    console.log("score in server is" + score);
    res.render('game.ejs', {
        thisusername: req.session.username,
        thisscore: score
    })
});


/* app.get('/sample', (req, res) => {
    res.render('sample.ejs', {
        title: 'Homepage',
        users: ['BRIan', 'TOM', 'JErrY']
    });
 
}) */

app.get('/admin', check.adminneedlogin, async (req, res) => {
    let leaderboard = await admin.displayLeaderboard();
    let allUsernameAndID = await admin.displayAllUser();
    res.render('admin.ejs', {
        thisleaderboard: leaderboard,
        thisallUsernameAndID: allUsernameAndID
    });
});

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

app.post('/adminresetpassword', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data = data + chunk;
    })
    req.on('end', async () => {
        obj = JSON.parse(data);//from json to object
        await admin.resetPassword(obj).then((content) => {
            if (typeof content !== "number") {
                console.log(content);
                res.send({ code: content.username });//automatically change to json
            }
            else {
                res.send({ code: content });
            }

        })
    })

});


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

app.post('/getleaderboard', async (req, res) => {
    await admin.displayLeaderboard().then((content) => {
        res.send(JSON.stringify(content));
    });
});


app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

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


app.post('/getfeedback', async (req, res) => {
    let content = await user.showFeedback();
    console.log(content);
    let result = JSON.stringify(content);
    res.send(result);
});

app.post('/updatefeedback', async (req, res) => {
    console.log(req.body);
    let content = await user.updateFeedback(req.body);
    console.log(content);
    res.end();
});
const server = app.listen(3000);
module.exports = app;