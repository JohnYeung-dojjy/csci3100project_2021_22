var mongoose = require("mongoose");

var MapSchema = mongoose.Schema({
	map_id: { type: Number, required: true, unique: true },
	image: { type: String, required: true, unique: true }
});