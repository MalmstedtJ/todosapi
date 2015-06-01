var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var todos = require('../models/todos');
//var todoRates = require('../models/todoRates');

//Get all todos
router.get('/', function(req, res) {
	todos.GetAll(function(data){
		res.send(data);
	});
});

// //Get all downrates
// router.get('/downrates', function(req, res) {
// 	todoRates.GetAll(function(data){
// 		res.send(data);
// 	});
// });

//Get todo by id
router.get('/:id', function(req, res) {
	var id = req.params.id;
	todos.GetById(id, function(data){
		res.send(data);
	});
});

//Add todo
router.post('/', function(req, res){
	var desc = req.body.description;
	todos.Add(desc, function(success){
		var code = success ? 200 : 417;
		res.sendStatus(code);
	})
});

//Delete todo
router.delete('/:id', function(req, res){
	var id = req.params.id;
	todos.Delete(id, function(err, success){
		if(success){res.send(200)}
		else{res.send(err)}
	});
});

//Up rate the specified todo
router.put('/uprate/:id', function(req, res) {
	var ip = GetIP(req);
	var id = req.params.id;
	todos.Rate(id, ip, 'up', function(success){
		console.log("in routes after callback function");
		console.log("success? "+success);
		if(success){res.sendStatus(200)}
		else{res.sendStatus(304)}
	});
});

//Down rate the specified todo
router.put('/downrate/:id', function(req, res) {
	var ip = GetIP(req);
	var id = req.params.id;
	todos.Rate(id, ip, 'down', function(success){
		if(success){res.sendStatus(200)}
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

module.exports = router;