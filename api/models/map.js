/* Map Data Schema
*/
var mongoose = require("mongoose");
const express = require("express");

var MapSchema = mongoose.Schema({
	map_id: { type: Number, required: true, unique: true },
	image: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Map", MapSchema);
