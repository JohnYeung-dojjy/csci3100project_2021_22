/* User Data schema 
*/

var mongoose = require("mongoose");
const express = require("express");

var UserSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	user_icon: { type: Buffer },
	user_email: { type: String, required: true },
	admin: { type: Boolean, required: true }
});

module.exports = mongoose.model("User", UserSchema);
