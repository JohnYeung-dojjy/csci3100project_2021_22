/* This file contains all the database function for users

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

module.exports = {displayUsername, displayEmail, displayIcon, displayBestScore, changePassword};


//display functions

async function displayUsername(_id){
    try{
        const username = await User.find({ _id: _id}).select("username");
        console.log(username);
        return username;
    }catch(err){
        console.log(err.message);
    }
}

async function displayEmail(_id){
    try{
        const email = await User.find({ _id: _id}).select("user_email");
        console.log(email);
        return email;
    }catch(err){
        console.log(err.message);
    }
}

async function displayIcon(_id){
    try{
        const icon = await User.find({ _id: _id}).select("user_icon");
        console.log(icon);
        return icon;
    }catch(err){
        console.log(err.message);
    }
}

async function displayUsername(_id){
    try{
        const username = await User.find({ _id: _id}).select("username");
        console.log(username);
        return username;
    }catch(err){
        console.log(err.message);
    }
}

async function displayBestScore(_id){
    try{
        const bestScore = await Leaderboard.find({ _id: _id}).select("score");
        console.log(bestScore);
        return bestScore;
    }catch(err){
        console.log(err.message);
    }
}

//change functions

async function changePassword( _id, oldPassword, newPassword){
    try{
        const acc = await User.find({_id: _id}).where("password").equals(oldPassword).updateOne({password: newPassword});
            console.log(acc);
        
        
    } catch (err) {
        console.log(err.message);
    }
}