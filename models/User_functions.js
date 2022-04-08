/* This file contains all the database function for users

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

module.exports = { displayInfo, displayBestScore, updateInfo, updateLeaderboard, showFeedback, updateFeedback, changepassword };


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
//!!! try to tell the server if the user has updated the icon(if the logic is too complex to implement with 
//single function, then add  one more displayicon() is ok, same, only object or number(for error) should be returned)
async function displayInfo(obj) {
    try {
        let content = await User.findOne({ username: obj.username }).lean().exec();
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

/* async function changePassword(obj, oldpassword, newpassword) {
    try {
        const query = await User.findOne({ username: obj.username, password: oldpassword }); //.where("password").equals(oldPassword)
        let content = query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    result.updateOne({ password: newpassword });
                    return result;

                }
            }
        )
        return content;

    } catch (err) {
        console.log(err.message);
        return -1;
    }
} */


//i will pass you the username and  the image in the obj
async function updateInfo(obj, photo) {
    try {
        let content = "success";
        let options = { returnDocument: 'after' };
        if (obj.newusername !== '') {
            let result = await User.findOne({ username: obj.newusername }).exec();
            if (result === null || result.length === 0) {
                await User.findOneAndUpdate({ username: obj.oldusername }, {
                    username: obj.newusername
                }, options).exec();
                obj.oldusername = obj.newusername;
            }
            else {
                content = "duplicated";
                return content;
            }
        }

        if (obj.newemail !== '' && photo === '') {
            await User.findOneAndUpdate({ username: obj.oldusername }, {
                user_email: obj.newemail
            }, options).exec();
        }
        else if (obj.newemail === '' && photo !== '') {
            await User.findOneAndUpdate({ username: obj.oldusername }, { $set: { 'user_icon.data': photo.data, 'user_icon.contentType': photo.contentType } }, options).exec();
        }
        else if (obj.newemail !== '' && photo !== '') {
            await User.findOneAndUpdate({ username: obj.oldusername }, {
                $set: { 'user_icon.data': photo.data, 'user_icon.contentType': photo.contentType, 'user_email': obj.newemail }
            }, options).exec();
        }
        return content;

    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

/* async function changeEmail(obj, oldEmail, newEmail) {
    try {
        if (oldEmail.equals(newEmail)) {
            console.log("New Email has to be different.");
            return 11100;
            //no need to check the email existance as user will receive a confirmation email in the registration
        } else {
            const check = await User.find({ user_email: newEmail })
            let content = check.then(
                async (result) => {
                    if (result === null || result.length === 0) {
                        const query = await User.find({ _id: obj._id });

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
} */

//completed, but need checking
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


async function changepassword(obj) {
    try {
        await User.findOneAndUpdate({ username: obj.username }, {
            password: obj.password
        }).exec();
        return "success";
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

//Feedback functions
//make sure that you return the lastest 5 feedback, as they haven't finished the feedback system yet, you can use
// the database function to create the feedback and then use showfeedback() to list the latest 5. 
async function showFeedback() {
    try {
        let query = Feedback.find().sort({ "_id": -1 }).limit(5).lean().exec();
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


//for the updatfeedback(), I will pass you the username and the feedback content only,
//the feedbackid should not be provided by me
// you can do the find() first to get the lastest id, or change another method.
//updateFeedback({username:"Patrick" , feedback:"Amazing game!"});
async function updateFeedback(obj) {
    try {

        let query = Feedback.find({ username: obj.username }).exec();
        let content = await query.then(
            async (result) => {
                if (result === null || result.length === 0) {
                    return 0;
                }
                else {
                    return result.length;
                }
            }
        );

        const instance = new Feedback({
            feedback_id: (content + 1),
            username: obj.username,
            feedback: obj.feedback
        });
        content = await instance.save().then(
            async (result) => {
                return await result.toObject();
            }
        );

        return content;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}