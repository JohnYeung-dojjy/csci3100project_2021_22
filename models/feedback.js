/**
 * feedback: This file contains the feedback data schema
 * 
 * Author: Patrick Gottschling
 * 
 * Version 1: Written 10 April 2022
 * 
 */

const express = require("express");
const { MongoNetworkError } = require("mongodb");
var mongoose = require("mongoose");

var FeedbackSchema = mongoose.Schema({
	feedback_id: { type: Number, required: true, unique: true },
	username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	feedback: { type: String }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);


