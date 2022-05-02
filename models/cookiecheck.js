/**
 * cookiecheck: This file contains functions that change the cookie and avoid user to visit specific pages without logging in.
 * 
 * Author: Xiao Qiang
 * 
 * Version 1: Written 8 April 2022
 * 
 * function:
 *  userneedlogin(req, res, next)   : Redirect the user to the login and registration page if the user tries to go to the home page without logging in.
 *  adminneedlogin(req, res, next)  : Redirect the user to the login and registration page if the user tries to go to the admin page without logging in.
 *  noneedlogin(req, res, next)     : Redirect the user to the admin page or the home page if the user has already logged in.
 *  cookiewrite(req, res, content)  : Write the username and if the user is admin into the cookie.
 */

const express = require("express");
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
        console.log('not authenticated');
        next();
    }
}

function cookiewrite(req, res, content) {
    req.session.username = content.username;
    req.session.admin = content.admin;
}




module.exports = { cookiewrite, adminneedlogin, userneedlogin, noneedlogin };