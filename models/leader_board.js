/**
 * leader_board: This file contains the leaderboard data schema
 * 
 * Author: Patrick Gottschling
 * 
 * Version 1: Written 10 April 2022
 * 
 */

var mongoose = require("mongoose");

var LeaderBoardSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model("Leaderboard", LeaderBoardSchema);

