const express = require("express");
const res = require("express/lib/response");
function needlogin(req, res, next) {
    if (req.session.username) {
        console.log('authenticated');
        next();
    } else {
        console.log('not authenticated');
        return res.redirect('/');
    }
}

function noneedlogin(req, res, next) {
    if (req.session.username) {
        console.log('authenticated');
        if (req.session.admin) {
            return res.redirect('/admin');
        }
        else {
            return res.redirect('/user');
        }
    } else {
        console.log('not authenticated');
        next();
    }
}

function cookiewrite(req, res, content) {
    req.session.username = content.username;
    req.session.admin = content.admin;
}




module.exports = { cookiewrite, needlogin, noneedlogin };