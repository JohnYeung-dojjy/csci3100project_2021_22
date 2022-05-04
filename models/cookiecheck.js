function userneedlogin(req, res, next) {
    // Check if the user is login and is not an admin
    if (req.session.username && req.session.admin === false) {
        console.log('authenticated');
        next();
    } else {
        // redirect to login and registration page
        console.log('not authenticated');
        return res.redirect('/');
    }
}

function adminneedlogin(req, res, next) {
    // Check if the user is login and is an admin
    if (req.session.username && req.session.admin === true) {
        console.log('authenticated');
        next();
    } else {
        // redirect to login and registration page
        console.log('not authenticated');
        return res.redirect('/');
    }
}

function noneedlogin(req, res, next) {
    // Check if the user is login
    if (req.session.username) {
        console.log('authenticated');
        // redirect to their page
        if (req.session.admin) {
            return res.redirect('/admin');
        }
        else {
            return res.redirect('/user');
        }
    } else {
        //continue the routing
        console.log('not authenticated');
        next();
    }
}

function cookiewrite(req, res, content) {
    //write cookie into the client machine
    req.session.username = content.username;
    req.session.admin = content.admin;
}




module.exports = { cookiewrite, adminneedlogin, userneedlogin, noneedlogin };