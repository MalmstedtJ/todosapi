var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	user: String,
	pass: String,
	admin: Boolean
});

mongoose.model('users', usersSchema);