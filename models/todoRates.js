var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TODO = require('../models/todos');

var todoRatesSchema = new Schema({
	todoID: String,
	ratersDir: Array
});

mongoose.model('todoRates', todoRatesSchema);

var RATING = mongoose.model('todoRates');
var TODOS = mongoose.model('todos');

function GetAll(callback){
	mongoose.model('todoRates').find(function(err, ratings){
    callback(ratings);
  });
}

function Rate(id, ip, direction, callback)
{
	var changed = false;

	GetByTodoId(id, function(todoRatings){
		//if there is an existing rating document for this todo
		if(todoRatings)
		{
			GetRaterByIP(todoRatings, ip, function(rating){
				if(rating){
					//user has already rated this todo before and in same direction
					if(rating.direction === direction) {
					changed = false;
					}
					//user has already rated this todo but different direction
					else{
						ChangeRateDir(todoRatings, rating, ip, direction);
						changed = true;
					}
				}
				//the document exist but the user has not rated yet
				else{
					AddRatingToDocument(todoRatings, ip, direction);
					changed = true;
				}
			});
		}
		//there isn't a rating document for this todo
		else{
			AddRatingDocument(id, ip, direction);
			changed = true;
		}
		//also change the rating on the actual todo object
		if(changed){
			TODO.ChangeTodoRating(id, direction, function(success){
				callback(success);
			});
		}
		else{callback(false)}
	});
}

//Private functions

function GetByTodoId(id, callback){
	var query = RATING.where({todoID: id});
	query.findOne(function(err, rating){
		callback(rating);
	});
}

function GetRaterByIP(todoRate, ip, callback){
	var query = todoRate.ratersDir.filter(function(r){ return r.ip === ip;});
	var found = query[0];
	if(found){callback(found)}
	else{callback(false)}
};

function ChangeRateDir(todoRatings, rating, ip, direction){
	var index = todoRatings.ratersDir.indexOf(rating);
	todoRatings.ratersDir.splice(index, 1);
	todoRatings.ratersDir.push({ip: ip, direction: direction});
	todoRatings.save();
}

function AddRatingToDocument(todoRatings, ip, direction){
	todoRatings.ratersDir.push({ip: ip, direction: direction});
	todoRatings.save();
}

function AddRatingDocument(todoId, ip, direction){
	var newDoc = new RATING({todoID: todoId, ratersDir: [{ip: ip, direction: direction}]});
	newDoc.save();
}

//Exports

module.exports.GetAll = GetAll;
module.exports.Rate = Rate;
