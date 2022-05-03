/**
 * Admin_function: This file contains all the database function for admins
 * 
 * Authors: Patrick Gottschling, Xiao Qiang
 * 
 * Version 1: Written 10 April 2022
 * 
 * function:
 *  displayAllUser(Obj)   : Returns all Users from the database
 *  displayLeaderboard(Obj)  : Returns the top 10 scores from the database
 *  resetPassword(Obj)    : Resets the password of the specified user
 *  deleteUserAccount(Obj)  : Deletes the specified user from the database
 *  deleteGameplay(Obj)   : Deletes the gameplay record of the specified user in the leaderboard
 */

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");
const { findOneAndDelete, deleteMany } = require("./User");

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


async function resetPassword(obj) {
    try {
        let query = User.findOne({ username: obj.username }).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    result.password = 'xxxx0000';
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


async function deleteUseraccount(obj) {
    try {
        let result = await User.findOne({ username: obj.username }).exec();
        if (result === null || result.length === 0) {
            return 11100;
        }
        else {
            await Feedback.deleteMany({ username: result._id.toString() }).exec();
            await Leaderboard.findOneAndDelete({ username: obj.username }).exec();
            await User.findOneAndDelete({ username: obj.username }).exec();
        }
        return "success";
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}


async function deleteGameplay(obj) {
    try {
        let result = await Leaderboard.findOne({ username: obj.username }).exec();
        if (result === null || result.length === 0) {
            return 11100;
        }
        else {
            await result.deleteOne();
            return "success";
        }
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

module.exports = { displayAllUser, displayLeaderboard, resetPassword, deleteUseraccount, deleteGameplay };