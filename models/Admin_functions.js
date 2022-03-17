/* This file contains all the database function for admins

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

async function displayAllUsers() {
    try {
        const record = await User.find();
        console.log(record);
        return record;
    } catch (err) {
        console.log(err.message);
    }
}

async function deleteUserAcc(username){
    try {
        //Add Not Null, else User not found. 
        const record = await User.find({username: username}).deleteOne();
        console.log(username + "has been deleted.");
    } catch (err) {
        console.log(err.message); 
    }
}

async function deleteUserRecord(obj){
    try {
        //Add Not Null, else User not found. 
        const record = await Leaderboard.find({user_id: obj._id}).deleteMany();
        console.log("Records have been deleted.");
    } catch (err) {
        console.log(err.message); 
    }
}

