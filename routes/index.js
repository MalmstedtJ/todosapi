var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var wstools = require('../tools/WS_UTILS');

/* GET home page. */
router.get('/', function(req, res, next) {
	var ws = req.app.get('wss');
	wstools.broadcast(ws, JSON.stringify({'event': 'test', message: 'Someone just accessed the index page of todoAPI!'}));

	res.render('index', { title: 'todoAPI' });
});
module.exports = router;
 