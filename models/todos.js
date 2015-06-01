var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	description: String,
	upraters: Array,
	downraters: Array,
	rating: Number,
});

mongoose.model('todos', todoSchema);

var TODO = mongoose.model('todos');

//Repository functions

function GetAll(callback){
	TODO.find()
	.select('-upraters -downraters') //exclude IPs
	.exec(function(err, todos){
    callback(todos);
  });
}

function Add(description, callback){
	var desc = description.trim();
	if (desc != '' && desc.length <= 80) {
		var newtodo = new TODO({description: desc, upraters: [], downraters: [], rating: 0});
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

function Rate(id, ip, direction, callback){
	var todo = GetById(id, function(todo){
		if(todo){
			if(direction === 'up'){
				var dindex = todo.downraters.indexOf(ip);
				if(dindex > -1){
					todo.downraters.splice(dindex, 1);
					todo.rating++;
				}
				if(todo.upraters.indexOf(ip) < 0){
					todo.upraters.push(ip);
					todo.rating++;
					todo.save();
					callback(true);
				}
				else{callback(false)}
			}
			else if(direction === 'down'){
				var uindex = todo.upraters.indexOf(ip);
				if(uindex > -1){
					todo.upraters.splice(uindex, 1);
					todo.rating--;
				}
				if(todo.downraters.indexOf(ip) < 0){
					todo.downraters.push(ip);
					todo.rating--;
					todo.save();
					callback(true);
				}
				else{callback(false)}
			}
			else{callback(false)}
		}
		else{callback(false)}
	});
}

//private functions

function GetById(id, callback){
	var query = TODO.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			callback(todo);
		}
		else{callback(err)}
	});
}

module.exports.GetAll = GetAll;
module.exports.Add = Add;
module.exports.Delete = Delete;
module.exports.Rate = Rate;