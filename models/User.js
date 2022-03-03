/* User Data schema 
*/

var mongoose = require("mongoose");
const express = require("express");

var UserSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: Number, required: true},
	user_icon: { type: Buffer, required: true},
    user_email: { type: String, required: true, unique: true},
    admin: { type: Boolean, required: true, unique: true}
});

module.exports = mongoose.model("User", UserSchema);
