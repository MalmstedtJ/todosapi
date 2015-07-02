var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var todos = require('../models/todos');
var wstools = require('../tools/WS_UTILS');

//Get all todos, only admins
router.get('/', function(req, res) {
	todos.GetAll(-5, function(data){
		res.send(data);
	});
});

//Add todo
router.post('/', function(req, res){
	var desc = req.body.description;
	if(desc){
		todos.Add(desc, function(success){
			var code = success ? 200 : 417;
			res.sendStatus(code);
			NotifyAdd(req.app.get('wss'));
		});
	}
	else{res.sendStatus(417)}
});

//Delete todo, only admins
router.delete('/:id', function(req, res){
	if(req.decoded && req.decoded.admin){
		var id = req.params.id;
		todos.Delete(id, function(err, success){
			if(success){
				console.log("Admin user: '"+req.decoded.user+"' just deleted todo with id: '"+id+"'");
				res.sendStatus(200)
				NotifyDelete(req.app.get('wss'));
			}
			else{res.send(err)}
		});
	}
	else{ res.sendStatus(403); }
});

//Up rate the specified todo
router.put('/uprate/:id', function(req, res) {
	var ip = GetIP(req);
	var id = req.params.id;
	todos.Rate(id, ip, 'up', function(success){
		if(success){
			res.sendStatus(200);
			NotifyRate(req.app.get('wss'));
		}
		else{res.sendStatus(304)}
	});
});

//Down rate the specified todo
router.put('/downrate/:id', function(req, res) {
	var ip = GetIP(req);
	var id = req.params.id;
	todos.Rate(id, ip, 'down', function(success){
		if(success){
			res.sendStatus(200);
			NotifyRate(req.app.get('wss'));
		}
		else{res.sendStatus(304)}
	});	
});

function GetIP(request){
	var ip = request.headers['x-forwarded-for'] || 
    request.connection.remoteAddress || 
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
    return ip;
}

function NotifyAdd(ws){
	var msg = {'event': 'todo.add', message: 'A new todo has been added!'}
	wstools.broadcast(ws, JSON.stringify(msg));
}

function  NotifyDelete(ws){
	var msg = {'event': 'todo.delete', message: 'A todo has been deleted!'}
	wstools.broadcast(ws, JSON.stringify(msg));
}

function NotifyRate(ws){
	var msg = {'event': 'todo.rate', message: 'A todo has been rated!'}
	wstools.broadcast(ws, JSON.stringify(msg));
}

module.exports = router;