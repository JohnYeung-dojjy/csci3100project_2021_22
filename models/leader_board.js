var mongoose = require("mongoose");

var LeaderBoardSchema = mongoose.Schema({
	user_id: { type: Number, required: true, unique: true },
    score: { type: Number, required: true}
});