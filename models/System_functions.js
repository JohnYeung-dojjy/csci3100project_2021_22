/**
 * System_functions: This file contains all the database function for the system
 * 
 * Authors: Patrick Gottschling,  Xiao Qiang
 * 
 * Version 1: Written 10 April 2022
 * 
 * function:
 *  registerNewAccount(Obj)   : Registers a new user account in the database
 *  loginAccount(Obj)  : Verifies login data and logs user in
 *  forgetPassword(Obj)    : Finds the user in the database to process a forget password machanism
 *  defaultIcon(Obj)  : Sets the default icon for an account 
 */

const User = require("./User");
module.exports = { registerNewAccount, loginAccount, defaulticon };

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