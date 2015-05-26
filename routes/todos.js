var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var todos = require('../models/todos');
var todos = require('../models/todoRates');
var ToDo = mongoose.model('todos');
var downRate = mongoose.model('todoRates')

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//Get all todos
router.get('/', function(req, res) {
  mongoose.model('todos').find(function(err, todos){
    res.send(todos);
  });
});

//Get all todos
router.get('/downrates', function(req, res) {
  mongoose.model('todoRates').find(function(err, rates){
    res.send(rates);
  });
});

//Get todo by id
router.get('/:id', function(req, res) {
	var id = req.params.id;
	var ToDo = mongoose.model('todos');
	var query = ToDo.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			res.send(todo);
		}
		else{res.send(err)}
	});
});

//Add todo
router.post('/', function(req, res){
	var desc = req.body.description;
	if (desc != '')
	{
		var newtodo = new ToDo({description: desc, downRating: '0'});
		newtodo.save();
	}
	res.send(200);
});

//Delete todo
router.delete('/:id', function(req, res){
	var id = req.params.id;
	var query = ToDo.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			todo.remove();
			res.send(200);
		}
		else{res.send(err)}
	});
});

//Increase the downRate of a specified todo
router.put('/downrate/:id', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
	var id = req.params.id;
	var query1 = downRate.where({todoID: id});
	var status = 500;
	query1.findOne(function(err, todoRates) {
		//if there is an existing downrating document for this todo
		if(todoRates){
			//if this user has downrated this todo before
			if(todoRates.downRaters.indexOf(ip) > -1){
				status = 304;
			}
			//the document exist but the user has not downrated yet
			else{
				todoRates.downRaters.push(ip);
				todoRates.save();
			}
		}
		//there isn't a downrating document for this todo
		else
		{
			var newRate = new downRate({todoID: id, downRaters: [ip]});
			newRate.save();
		}
	}).exec(function(){
		var query2 = ToDo.where({_id: id});

		query2.findOne(function (err, todo) {
		if(todo) {
			todo.downRating++;
			todo.save();
			status = 200;
		}
		else{res.send(err)}
		});

		res.sendStatus(status);
	});
});

module.exports = router;