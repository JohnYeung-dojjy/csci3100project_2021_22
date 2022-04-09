/*In this file the connection to the database it established.

It is used to call fuctions to manipulate the database or retrieve data with the functions in the
System_functions, Admin_functions and User_functions class.
The data schemas are defined in individual classes (User, map, feedback, leader_board)

Update: Currently I implement all these functions. The error handling with false input data and
 several checks are not finally implemented in the existing functions.

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
//System_functions.registerNewAccount("Bryan", 4321, "./test.jpeg", "fake@gmail.com", true );
//disconnectDB();
//System_functions.loginAccount("Bryan", 43216);
//User_functions.forgetPassword("621cc3e99e3dc13084e5c19e");
//User_functions.changePassword("621cc3e99e3dc13084e5c19e", 4321, 3333);

//User_functions.changePassword()




