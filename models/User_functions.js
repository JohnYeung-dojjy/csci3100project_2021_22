/* This file contains all the database function for users

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");
const { contentType } = require("express/lib/response");

module.exports = { displayBestScore, changePassword, updateLeaderboard, changeIcon, changeEmail };


/* //display functions,for now, we may not need this
async function displayUsername(obj) {
    try {
        const username = await User.find({ _id: obj._id }).select("username");
        console.log(username);
        return username;
    } catch (err) {
        console.log(err.message);
    }
}

//for now, we may not need this either
async function displayEmail(obj) {
    try {
        const email = await User.find({ _id: obj._id }).select("user_email");
        console.log(email);
        let content = email.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;
                }
            }
        )
    } catch (err) {
        console.log(err.message);
        return -1;
    }
} */

//!!!only display info is needed.
async function displayInfo(obj) {
    try {
        const query = await User.findOne({ username: obj.username }).lean().exec();
        let content = await query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;
                }
            }
        );
        return content;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

/* //display functions,for now, we may not need this
async function displayUsername(obj) {
    try {
        const query = await User.find({ _id: obj._id }).select("username");
        console.log(query);
        let content = query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;
                }
            }
        )
    } catch (err) {
        console.log(err.message);
        return -1;
    }
} */
//!!!completed
async function displayBestScore(obj) {
    try {
        let query = Leaderboard.findOne({ username: obj.username }).select("score").sort({ "score": 1 }).limit(1).lean().exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return "norecord";
                }
                else {
                    return result;
                }
            }
        );
        return content;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

//change functions

//todo add if-statement for wrong input
async function changePassword(obj) {
    try {
        const query = await User.find({ _id: obj._id }).where("password").equals(oldPassword).updateOne({ password: newPassword });
        console.log(query);
        let content = query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;

                }
            }
        )

    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

async function changeIcon(obj) {
    try {
        /* //prob not needed because upload manager will restrict that
        var parts = newImage.split('.');
        if (parts[parts.length - 1] == "jpg" || (parts[parts.length - 1] == "png" ){

        } else {
            console.log("File Format not accepted.");
        } */
        const query = await User.find({ _id: obj._id }).updateOne({ user_icon: newImage });
        console.log(query);
        let content = query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result;

                }
            }
        )

    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

async function changeEmail(obj) {
    try {
        if (oldEmail.equals(newEmail)) {
            console.log("New Email has to be different.");
            //no need to check the email existance as user will receive a confirmation email in the registration
        } else {
            const check = await User.find({ user_email: newEmail })
            let content = check.then(
                async (result) => {
                    if (result === null || result.length === 0) {
                        const query = await User.find({ _id: obj._id }).where("user_email").equals(oldEmail);
                        console.log(query);
                        let content = query.then(
                            (result) => {
                                if (result === null || result.length === 0) {
                                    return 11100;
                                }
                                else {
                                    result.updateOne({ user_email: newEmail });
                                    return result;

                                }
                            }
                        )
                    }
                    else {
                        console.log("Email is already registered.");
                        return 11100;

                    }
                }
            )
        }

    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

//completed!!
// as login verification is done, the user must exist
async function updateLeaderboard(obj) {
    try {
        let query = Leaderboard.findOne({ username: obj.username }).select("score").sort({ "score": 1 }).limit(1).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return "norecord";
                }
                else {
                    result.score = obj.score;
                    await result.save();
                    return await result.toObject();
                }
            }
        );
        if (content === "norecord") {
            console.log("this is no record");
            const instance = new Leaderboard({
                username: obj.username,
                score: obj.score
            });
            content = await instance.save().then(
                async (result) => {
                    return await result.toObject();
                }
            );
        }
        return content;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}