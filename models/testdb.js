/**
 * testdb: This file is only to test statements in the database
 * 
 * Author: Patrick Gottschling
 * 
 * Version 1: Written 10 April 2022

 */

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

const System_functions = require("./System_functions");
const User_functions = require("./User_functions");


const DBuri = 'mongodb+srv://patrillicit:csci3100@cluster0.5gdcy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
/* 'mongodb://127.0.0.1:27017/' //this is for local test, please don't delete! */;


//conncet with Cloud DB on Atlas
async function conncetToCloudDB() {
    mongoose.connect(DBuri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => console.log('connected to DB.'))
        .catch((err) => console.log(err));
}

//disconncet with database
async function disconnectDB() {
    mongoose.connection.close().then(() => console.log('Connection Closed successfully!')).catch((err) => console.log(err));
}

//call functions for testing

conncetToCloudDB();


/*
!!!! do not try to use the database function to directly create the data
*/
//System_functions.registerNewAccount({username: "1234", password:"1234", user_email: "1234@gmail.com", admin: true} );
//disconnectDB();
//System_functions.loginAccount("Bryan", 43216);
//User_functions.forgetPassword("621cc3e99e3dc13084e5c19e");
//User_functions.changePassword("621cc3e99e3dc13084e5c19e", 4321, 3333);

//User_functions.changePassword()




