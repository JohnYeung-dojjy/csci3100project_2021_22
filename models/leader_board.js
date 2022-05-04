/* Leaderboard Data Schema
*/

var mongoose = require("mongoose");

var LeaderBoardSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model("Leaderboard", LeaderBoardSchema);

