var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	description: String
});

mongoose.model('todos', todoSchema);