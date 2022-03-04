/* This file contains all the database function of the system

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");
const { countDocuments } = require("./User");
const { get } = require("jquery");

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
            .then((acc) => {
                console.log('User Saved Successfully!');
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

async function loginAccount(obj) {
    try {
        let code = await User.findOne({ username: obj.username, password: obj.password }).lean().then((acc) => {
            if (acc !== null) {
                return acc._id.toString();
            }
            else {
                return 11100;
            }
        }).catch((err) => {
            console.log(err);
            return err.code;
        })
        return code;
    } catch (err) {
        console.log(err.message);
        return -1;
    }
}

async function forgetUserName(user_email) {
    //Maybe we don't need this?I prefer that people can only use unique username and email to retrive their password.

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

