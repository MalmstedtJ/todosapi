var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/users');
var User = mongoose.model('users');

//Get all users
router.get('/', function(req, res) {
	mongoose.model('users').find(function(err, users){
		if(users){
			res.send(users);
		}
		else{
			res.sendStatus(403);
		}
		
	});
});

//Get user
router.get('/:id', function(req, res) {
	var id = req.params.id;
	var User = mongoose.model('users');
	var query = User.where({_id: id});
	query.findOne(function (err, user) {
		if(user) {
			res.send(user);
		}
		else{res.send(err)}
	});
});

//Add user
router.post('/', function(req, res){
	var user = req.body.user;
	var pass = req.body.pass;
	var admin = req.body.admin;
	if (user != '' && pass != '' && (admin === 'true' || admin === 'false'))
	{
		var usr = new User({user: user, pass: pass, admin: admin});
		usr.save();
		res.send(200);
	}
	else{
		res.send(304);
	}
});

//Delete user
router.delete('/{user_id}', function(req, res){
	var id = user_id;
	var query = User.where({_id: id});
	query.findOne(function (err, user) {
		if(user) {
			user.remove();
			res.send(200);
		}
		else{res.send(err)}
	});
});

module.exports = router;
