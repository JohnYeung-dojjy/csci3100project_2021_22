/* This file contains all the database function of the system

! not yet completed, functions need to be modified to check input data and handle wrong input
*/
var mongoose = require("mongoose");
const User = require("./User");
const Map = require("./map");
const Leaderboard = require("./leader_board");
const Feedback = require("./feedback");
const { countDocuments } = require("./User");
module.exports = { registerNewAccount, loginAccount, forgetPassword, defaulticon };

/*
the following function demostrates a save() for database creation and update
again, you most likely modify only instance every time.
with this implementation, duplicate key situation will caught, and -1 will be returned
 I don't need you return me a specific data but only ensure that the whole data type is  'object'
*/
async function registerNewAccount(obj) {
    try {
        const instance = new User({
            username: obj.username,
            password: obj.password,
            user_email: obj.user_email,
            admin: obj.admin
        });
        let content = await instance.save().then(
            async (result) => {
                return await result.toObject();
            }
        )
        return content;
    } catch (e) {
        console.log(e.message);
        return -1;
    }
}


// the following demostrates find() method, if you use find() with lean(), it will return you an array of object.
async function loginAccount(obj) {
    try {
        let query = User.find({ username: obj.username, password: obj.password }).lean().exec();
        //lean() can only be used in findone() and find(), it has no use with save();
        let content = await query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    return result[0];
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
This method draw a template for you with findOne() function,
I deliberately separate the query and arrow function,so most of the time you only need to modify the query part
*/
/* async function loginAccount(obj) {
    try {
        let query = User.findOne({ username: obj.username, password: obj.password }).lean().exec();
        //By using lean(), the server can directly get an object which is more convenient to use.
       //lean() can only be used in findone() and find(), it has no use with save();
        let content = query.then(
            (result) => {
                if (result === null || result.length === 0) {
                    return 11100;
                }
                else {
                    console.log(result);
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
} */


async function forgetPassword(obj) {
    try {
        let query = User.findOne({ username: obj.username }).lean().exec();
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
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
}

/* async function forgetUsername(obj) {
    try {
        let query = User.findOne({ user_email: obj.user_email }).lean().exec();
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
        return content;
    }
    catch (err) {
        console.log(err.message);
        return -1;
    }
} */

async function defaulticon(obj, photo) {
    try {
        await User.findOneAndUpdate({ username: obj.username }, {
            $set: { 'user_icon.data': photo.data, 'user_icon.contentType': photo.contentType }
        }).exec();
    } catch (e) {
        console.log(e.message);
        return -1;
    }
}