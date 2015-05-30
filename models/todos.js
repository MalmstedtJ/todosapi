var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	description: String,
	rating: Number,
});

mongoose.model('todos', todoSchema);