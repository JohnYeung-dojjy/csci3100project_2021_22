/* This file contains all the database function for admins
completed!!!
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

async function displayAllUser() {
    try {
        let query = User.find().lean().exec();
        //lean() can only be used in findone() and find(), it has no use with save();
        let content = await query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;
                }
            }
        )
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

//modified!!!!
async function displayLeaderboard() {
    try {
        let result = await Leaderboard.find().sort("-score").limit(10).lean().exec();
        //let query = Leaderboard.find().sort({ "score": -1 }).limit(10).lean().exec();

        //lean() can only be used in findone() and find(), it has no use with save();
        if (result === null || result.length === 0) {
            return 11100;
        }
        else {
            return result;
        }
    }


    catch (err) {
        console.log(err.message);
        return -1;
    }
}

//!!modified
async function resetPassword(obj) {
    try {
        let query = User.findOne({ username: obj.username }).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    result.password = '0000';
                    await result.save();
                    return result.toObject();
                }
            }
        )
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

/* 
logic is similar, delete the user record in all collections, if first one is success, then, username input by the
admin is correct. However, the user may have no record in feedback and leaderboard(no feedback left,no game played)
*/

async function deleteUseraccount(obj) {
    try {
        let query = User.findOne({ username: obj.username }).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    await result.deleteOne();
                    return "success";
                }
            }
        );
        if (content === "success") {
            query = Leaderboard.findOne({ username: obj.username }).exec();
            content = await query.then(
                async (result) => {
                    if (result === null || result.length === 0) {
                        return "success";
                    }
                    else {
                        await result.deleteOne();
                        return "success";
                    }
                }
            );
        }
        if (content === "success") {
            query = Feedback.find({ username: obj.username }).exec();
            content = await query.then(
                async (result) => {
                    if (result === null || result.length === 0) {
                        return "success";
                    }
                    else {
                        await result.deleteMany();
                        return "success";
                    }
                }
            );
        }
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}


async function deleteGameplay(obj) {
    try {
        let query = Leaderboard.findOne({ username: obj.username }).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    await result.deleteOne();
                    return "success";
                }
            }
        );
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

module.exports = { displayAllUser, displayLeaderboard, resetPassword, deleteUseraccount, deleteGameplay };