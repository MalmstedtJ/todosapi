var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var wstools = require('../models/WS_UTILS');

/* GET home page. */
router.get('/', function(req, res, next) {
	var ws = req.app.get('ws');
	wstools.broadcast(ws, "Someone is accessing the index page!");
	res.render('index', { title: 'todoAPI' });
});
module.exports = router;
 