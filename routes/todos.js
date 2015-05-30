var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var todos = require('../models/todos');
var todos = require('../models/todoRates');
var ToDo = mongoose.model('todos');
var rate = mongoose.model('todoRates')
var async = require('async');

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
	if (desc != '' && desc.length <= 80)
	{
		var newtodo = new ToDo({description: desc, rating: '0'});
		newtodo.save();
	}
	else{
		res.sendStatus(417); //expectation failed
	}
	res.sendStatus(200);
});

//Delete todo
router.delete('/:id', function(req, res){
	var id = req.params.id;
	var query = ToDo.where({_id: id});
	query.findOne(function (err, todo) {
		if(todo) {
			todo.remove();
			res.sendStatus(200); 
		}
		else{res.send(err)}
	});
});

//Downrate the specified todo
router.put('/uprate/:id', function(req, res) {
	Rate(req, res, 'up');
});

//Uprate the specified todo
router.put('/downrate/:id', function(req, res) {
	Rate(req, res, 'down');
});

function Rate(request, response, direction)
{
	var ip = request.headers['x-forwarded-for'] || 
     request.connection.remoteAddress || 
     request.socket.remoteAddress ||
     request.connection.socket.remoteAddress;
	var id = request.params.id;

	var status = 200;
	var query1 = rate.where({todoID: id});
	var call1 = function(next){
		query1.findOne(function(err, todoRates){
		//if there is an existing rating document for this todo
		if(todoRates){
			var query = todoRates.ratersDir.filter(function(r){ return r.ip === ip;});
			var found = query[0];
			console.log(query);
			//user has already rated this todo before and in same direction
			if(found !== undefined && found.direction === direction){
				status = 304; //not modified
				next();
			}
			//user has already rated this todo but different direction
			else if(found !== undefined && found.direction !== direction){
				var index = todoRates.ratersDir.indexOf(found);
				todoRates.ratersDir.splice(index, 1);
				todoRates.ratersDir.push({ip: ip, direction: direction});
				todoRates.save();
				next();
			}
			//the document exist but the user has not rated yet
			else{
				todoRates.ratersDir.push({ip: ip, direction: direction});
				todoRates.save();
				next();
			}
		}
		//there isn't a rating document for this todo
		else{
			var newRate = new rate({todoID: id, ratersDir: [{ip: ip, direction: direction}]});
			newRate.save();
			next();
		}
	});
	}

var call2 = function(next){
	if(status != 304) {
		var query2 = ToDo.where({_id: id});
		query2.findOne(function (err, todo) {
			if(todo) {
				if(direction === 'down')
				{
					todo.rating--;
				}
				else if (direction === 'up')
				{
					todo.rating++;
				}
			todo.save();
			status = 200;
		}
		else{response.send(err)}
		});
	}
	next();	
	};

var call3 = function(next){
	response.sendStatus(status);
	next();
}

async.series([call1, call2, call3]);
}

module.exports = router;