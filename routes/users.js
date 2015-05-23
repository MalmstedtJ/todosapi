var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/users');
var User = mongoose.model('users');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//Get all users
router.get('/', function(req, res) {
  mongoose.model('users').find(function(err, users){
    res.send(users);
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
	var namn = req.body.name;
	if (namn != '')
	{
		var bla = new User({name: namn});
		bla.save();
	}
	res.send(200);
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
