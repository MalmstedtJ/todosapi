var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoRatesSchema = new Schema({
	todoID: String,
	downRaters: Array
});

mongoose.model('todoRates', todoRatesSchema);