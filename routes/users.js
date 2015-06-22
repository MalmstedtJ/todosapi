var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/users');
var User = mongoose.model('users');

//Get all users, only admins
router.get('/', function(req, res) {
	if(req.decoded && req.decoded.admin){
		mongoose.model('users').find(function(err, users){
			if(users){
				res.send(users);
				console.log("Admin user: '"+req.decoded.user+"' just fetched all users");
			}
			else{ res.sendStatus(403); }
		});
	}
	else{ res.sendStatus(550); }
});

//Get user, only admins
router.get('/:id', function(req, res) {
	if(req.decoded && req.decoded.admin){
		var id = req.params.id;
		var User = mongoose.model('users');
		var query = User.where({_id: id});
		query.findOne(function (err, user) {
			if(user) { 
				res.send(user);
				console.log("Admin user: '"+req.decoded.user+"' just fetched user with id: '"+id+"'");
			}
			else{ res.send(err); }
		});
	}
	else{ res.sendStatus(550); }
});

//Add user, only admins
router.post('/', function(req, res){
	if(req.decoded && req.decoded.admin){
		var user = req.body.user;
		var pass = req.body.pass;
		var admin = req.body.admin;
		if (user != '' && pass != '' && (admin === true || admin === false))
		{
			var usr = new User({user: user, pass: pass, admin: admin});
			usr.save();
			console.log("Admin user: '"+req.decoded.user+"' just added user with id: '"+usr.id+"' and name: '"+usr.name+"'");
			res.sendStatus(200);
		}
		else{
			res.sendStatus(304);
		}
	}
	else{ res.sendStatus(550); }
});

//Delete user, only admins
router.delete('/{user_id}', function(req, res){
	if(req.decoded && req.decoded.admin){
		var id = user_id;
		var query = User.where({_id: id});
		query.findOne(function (err, user) {
			if(user) {
				user.remove();
				console.log("Admin user: '"+req.decoded.user+"' just deleted user with id: '"+id+"'");
				res.sendStatus(200);
			}
			else{res.send(err)}
		});
	}
	else{
		res.sendStatus(550);
	}
});

module.exports = router;
