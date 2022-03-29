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
}

async function displayIcon(obj) {
    try {
        const icon = await User.find({ _id: obj._id }).select("user_icon");
        console.log(icon);
        let content = icon.then(
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

//display functions,for now, we may not need this
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
}

async function displayBestScore(obj) {
    try {
        const query = await Leaderboard.find({ _id: obj._id }).select("score").sort({ "score": 1 }).limit(1);
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

//change functions

//todo add if-statement for wrong input
async function changePassword(obj, oldPassword, newPassword) {
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

async function changeIcon(obj, newImage) {
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

async function changeEmail(obj, oldEmail, newEmail) {
    try {
        if (oldEmail.equals(newEmail)) {
            console.log("New Email has to be different.");
            //add a check if email already exits?
        } else {
            const check = await User.find({user_email: newEmail})
            let content = check.then(
                (result) => {
                    if (result === null || result.length === 0) {
                        const query = await User.find({ _id: obj._id }).where("user_email").equals(oldEmail);
                        console.log(query);
                        let content = query.then(
                            (result) => {
                                if (result === null || result.length === 0) {
                                    return 11100;
                                }
                                else {
                                    result.updateOne({ user_email: newEmail});
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