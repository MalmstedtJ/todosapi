var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
	var io = req.app.get('io');
	io.emit('event', 'Someone has reached todoAPI index page!')
	res.render('index', { title: 'todoAPI' });
});
module.exports = router;
 