const express = require("express");

var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
	feedback_id: { type: Number, required: true, unique: true },
	user_id: { type: String, required: true, unique: true },
	feedback: { type: String }
});