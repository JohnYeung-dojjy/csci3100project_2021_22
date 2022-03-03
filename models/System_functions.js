/* This file contains all the database function of the system

! not yet completed, functions need to be modified to check input data and handle wrong input
*/

var mongoose = require("mongoose");
const express = require("express");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");

module.exports = {registerNewAccount, loginAccount, forgetPassword, forgetUserName};

async function registerNewAccount(username, password, user_icon, user_email, admin){
    try{
        const user = new User({
            username: username,
            password: password,
            user_icon: user_icon,
            user_email: user_email,
            admin: admin
        });
        await user.save()
    .then(() => console.log('User Saved Successfully!'))
    .catch((err) => console.log(`Error in Saving User: ${err}`));
        console.log(user);
    } catch (e){
        console.log(e.message);
    }

}

 async function loginAccount(username, password){
    try{
        const acc = await User.find({username: username, password: password});
        console.log(acc);
        return acc;
    } catch (err) {
        console.log(err.message);
    }
    
}

async function forgetUserName(user_email){
    //Login with Username or Email or both?

}

async function forgetPassword(_id){
    try{
        const email = await User.find({_id: _id}).select("user_email");
        console.log(email);
        //send email, new password mechanism??
    } catch (err) {
        console.log(err.message);
    }
}
 
