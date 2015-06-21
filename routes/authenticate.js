var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var users = require('../models/users');
var User = mongoose.model('users');

router.get('/', function(req,res){
	res.sendStatus(200);
});

// Authenticate user
router.post('/', function(req, res){
	if(req.body.user){
  	User.findOne({ user: req.body.user}, 
      function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else if (user) {
          // check if password matches
          if (user.pass != req.body.pass) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          }
          else if (user.admin != req.body.admin) {
            res.json({ success: false, message: 'Authentication failed. Wrong role.' });
          } 
          else {
            // if user is found and password is right
            // create a token
            console.log(config.secret);
            var token = jwt.sign(user, config.secret, {
              expiresInMinutes: 1440 // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }   
        }
      });
}
else {res.sendStatus(404);}
});

module.exports = router;
 