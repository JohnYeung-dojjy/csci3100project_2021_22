const express = require("express");
const { MongoNetworkError } = require("mongodb");

/* Feedback Data Schema
*/

var mongoose = require("mongoose");
//const express = require("express");

var FeedbackSchema = mongoose.Schema({
	feedback_id: { type: Number, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	feedback: { type: String }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);


