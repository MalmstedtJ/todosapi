var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var images = require('../models/images');

var dailyImage;

/* GET home page. */
router.get('/', function(req, res, next) {
	images.GetAll(function(data){
		console.log(data);
		res.send(data);
	});
});

router.get('/daily', function(req, res, next) {
	if(!dailyImage || dailyImage.date < new Date().setHours(0,0,0,0)){
		console.log('caching new random image');
		dailyImage = GetNewDaily();
	}
	console.log('sending cached image');
	res.send(dailyImage);
});

router.post('/', function(req, res, next){
	var URL = req.body.url;
	console.log(URL);
	if(URL){
		images.Add(URL, function(success){
			if(success){
				res.sendStatus(200)
			}
			else{res.sendStatus(404)}
		});
	}
	else{res.sendStatus(404)}
});

function GetNewDaily(){
	var today = new Date().setHours(0,0,0,0);
	images.GetRandom(function(data){
		return dailyImage = {
			date: today,
			url: data.url
		};
	});
}

module.exports = router;
 