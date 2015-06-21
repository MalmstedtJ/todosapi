var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var images = require('../models/images');

var dailyImage;

// GET all images, only admins
router.get('/', function(req, res, next) {
	if(req.decoded && req.decoded.admin){
		images.GetAll(function(data){
			res.send(data);
			console.log("Admin user: '"+req.decoded.user+"' just fetched all images");
		});
	}
	else{ res.sendStatus(550); }
});

//Get daily image
router.get('/daily', function(req, res, next) {
	if(!dailyImage || dailyImage.date < new Date().setHours(0,0,0,0)){
		console.log('caching new random image');
		GetNewDaily(function(img){
			dailyImage = img;
			res.send(dailyImage);
		});
	}
	else{
		console.log('sending cached image');
		res.send(dailyImage);
	}
});

//Add new image, only admins
router.post('/', function(req, res, next){
	if(req.decoded && req.decoded.admin){
		var URL = req.body.url;
		console.log(URL);
		if(URL){
			images.Add(URL, function(success){
				if(success){
					res.sendStatus(200)
					console.log("Admin user: '"+req.decoded.user+"' just added image with url: '"+URL+"'");
				}
				else{res.sendStatus(404)}
			});
		}
		else{res.sendStatus(404)}
	}
	else { res.sendStatus(550); }
});

function GetNewDaily(callback){
	var today = new Date().setHours(0,0,0,0);
	images.GetRandom(function(data){
		var dailyImage = {
			date: today,
			url: data.url
		};
		callback(dailyImage);
	});
}

module.exports = router;
 