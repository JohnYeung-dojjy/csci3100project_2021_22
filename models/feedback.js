/* Feedback Data Schema
*/

var mongoose = require("mongoose");

var FeedbackSchema = mongoose.Schema({
	feedback_id: { type: Number, required: true, unique: true },
	username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	feedback: { type: String }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);


