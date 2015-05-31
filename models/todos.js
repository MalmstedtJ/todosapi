var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	description: String,
	rating: Number,
});

mongoose.model('todos', todoSchema);

var TODO = mongoose.model('todos');

//Repository functions

function GetAll(callback){
	TODO.find(function(err, todos){
    callback(todos);
  });
}

function GetById(id, callback){
	var query = TODO.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			callback(todo);
		}
		else{callback(err)}
	});
}

function Add(description, callback){
  if (description != '' && description.length <= 80)
	{
		var newtodo = new TODO({description: description, rating: '0'});
		newtodo.save();
		callback(true);
	}
	else{
		callback(false);
	}
}

function Delete(id, callback){
	var query = TODO.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			todo.remove();
			callback(err, true);
		}
		else{callback(err, false)}
	});
}

function ChangeTodoRating(id, direction, callback){
	var query = TODO.where({_id: id});
	query.findOne(function (err, todo) {
	if(todo) {
		if(direction === 'down'){
			todo.rating--;
			todo.save();
			callback(true);
		}
		else if(direction === 'up'){
			todo.rating++;
			todo.save();
			callback(true);
		}
	}
	else {callback(false)}
	});
}

module.exports.GetAll = GetAll;
module.exports.GetById = GetById;
module.exports.Add = Add;
module.exports.Delete = Delete;
module.exports.ChangeTodoRating = ChangeTodoRating;