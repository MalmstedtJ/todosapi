var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	description: String,
	downRating: Number,
});

mongoose.model('todos', todoSchema);