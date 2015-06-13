var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
	url: String
});

mongoose.model('images', imageSchema);

var IMAGE = mongoose.model('images');

function Add(url, callback){
	var URL = url.trim();
	if (URL != '') {
		var newimage = new IMAGE({url: URL});
		console.log('Saving image' + newimage);
		newimage.save();
		callback(true);
	}
	else{
		callback(false);
	}
}

function GetAll(callback){
	IMAGE.find({}, function(err, result){
		console.log('in model' + result);
		callback(result);
	});
}

function GetRandom(callback){
	IMAGE.count().exec(function(err, count){
	  var random = Math.floor(Math.random() * count);
	  IMAGE.findOne().skip(random).exec(
	    function (err, result) {
	    	callback(result);
	  });
	});
}

module.exports.Add = Add;
module.exports.GetAll = GetAll;
module.exports.GetRandom = GetRandom;