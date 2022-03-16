/* This file contains all the database function for users

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

module.exports = { displayUsername, displayEmail, displayIcon, displayBestScore, changePassword };


//display functions,for now, we may not need this
async function displayUsername(_id) {
    try {
        const username = await User.find({ _id: _id }).select("username");
        console.log(username);
        return username;
    } catch (err) {
        console.log(err.message);
    }
}

//for now, we may not need this either
async function displayEmail(_id) {
    try {
        const email = await User.find({ _id: _id }).select("user_email");
        console.log(email);
        return email;
    } catch (err) {
        console.log(err.message);
    }
}

async function displayIcon(_id) {
    try {
        const icon = await User.find({ _id: _id }).select("user_icon");
        console.log(icon);
        return icon;
    } catch (err) {
        console.log(err.message);
    }
}

//display functions,for now, we may not need this
async function displayUsername(_id) {
    try {
        const username = await User.find({ _id: _id }).select("username");
        console.log(username);
        return username;
    } catch (err) {
        console.log(err.message);
    }
}

async function displayBestScore(_id) {
    try {
        const bestScore = await Leaderboard.find({ _id: _id }).select("score");
        console.log(bestScore);
        return bestScore;
    } catch (err) {
        console.log(err.message);
    }
}

//change functions
async function changePassword(_id, oldPassword, newPassword) {
    try {
        const acc = await User.find({ _id: _id }).where("password").equals(oldPassword).updateOne({ password: newPassword });
        console.log(acc);


    } catch (err) {
        console.log(err.message);
    }
}

//Leaderboard functions

async function displayLeaderboard(obj){
    try {
        const lb = await Leaderboard.find().sort({"score":1}).limit(10);
        console.log(lb);
        return lb;
    } catch (err) {
        console.log(err.message);
    }
}

async function updateLeaderboard(_id, score) {
    try {
        const instance = new Leaderboard({
            user_id: _id,
            score: score
        });
        let state = await instance.save()
            .then((acc) => {
                console.log('Leaderboard Updated Successfully!');
                console.log(typeof acc.id);//string;
                return acc.id;
            })
            .catch(
                (err) => {
                    console.log(err);
                    return err.code;//number
                }
            )
        return state;// if duplicate,the code is 11000,defined by mongodb
    } catch (e) {
        console.log(e.message);
        return -1;
    }
}