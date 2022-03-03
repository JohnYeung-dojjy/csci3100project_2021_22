/* This file contains all the database function of the system

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");
const { countDocuments } = require("./User");

module.exports = { registerNewAccount, loginAccount, forgetPassword, forgetUserName };

async function registerNewAccount(obj) {
    try {
        const instance = new User({
            username: obj.username,
            password: obj.password,
            user_email: obj.user_email,
            admin: obj.admin
        });
        let state = await instance.save()
            .then(() => {//normally it will return the instance, but code is easily to recognize
                console.log('User Saved Successfully!');
                console.log(instance);
                return 0;
            })
            .catch(
                (err) => {
                    console.log(err);
                    return err.code;
                }
            )
        return state;//if 0, it is success, if duplicate,the code is 11000
    } catch (e) {
        console.log(e.message);
        return -1;
    }
}

async function loginAccount(username, password) {
    try {
        const acc = await User.find({ username: username, password: password });
        console.log(acc);
        return acc;
    } catch (err) {
        console.log(err.message);
    }

}

async function forgetUserName(user_email) {
    //Login with Username or Email or both?

}

async function forgetPassword(_id) {
    try {
        const email = await User.find({ _id: _id }).select("user_email");
        console.log(email);
        //send email, new password mechanism??
    } catch (err) {
        console.log(err.message);
    }
}

