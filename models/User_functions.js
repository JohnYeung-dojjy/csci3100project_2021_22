/**
 * User_functions: This file contains all the database function for users
 * 
 * Authors: Patrick Gottschling,  Xiao Qiang
 * 
 * Version 1: Written 10 April 2022
 * 
 * function:
 *  displayInfo(Obj)   : Returns the user data from the database
 *  displayBestScore(Obj)  : Returns the user's best score
 *  updateInfo(Obj)    : modifies the user data from the specified information
 *  updateLeaderboard(Obj)  : adds the new score to the leaderboard, if it is better than the best previous score
 *  showFeedback(Obj)   : Returns the 5 latest feedbacks from the database
 *  updateFeedback(Obj)   : Adds the feedback to the database
 *  changePassword(Obj)   : Changes the user's password
 */
const User = require("./User");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

module.exports = { displayInfo, displayBestScore, updateInfo, updateLeaderboard, showFeedback, updateFeedback, changepassword };

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

async function showFeedback() {
    try {
        let result = await Feedback.find().sort({ "_id": -1 }).limit(5).populate({
            path: 'username',
            select: { username: 1, user_icon: 1 }
        }).lean().exec();
        if (result === null || result.length === 0) {
            return "nofeedback"
        }
        return result;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

async function updateFeedback(obj) {
    try {
        let info = await User.findOne({ username: obj.username }).lean().exec();
        let result = await Feedback.find({ username: info._id.toString() }).lean().exec();
        let length = (result.length > 0) ? result.length + 1 : 1;
        const instance = new Feedback({
            feedback_id: length,
            username: info._id.toString(),
            feedback: obj.feedback
        });
        let content = await instance.save();
        content = await content.toObject();
        return content;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}