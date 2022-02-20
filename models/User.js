var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
	user_id: { type: Number, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: Number, required: true},
	user_icon: { type: Data, required: true},
    user_email: { type: String, required: true, unique: true},
    admin: { type: Boolean, required: true, unique: true}
});