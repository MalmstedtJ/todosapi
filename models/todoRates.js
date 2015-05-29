var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoRatesSchema = new Schema({
	todoID: String,
	ratersDir: Array
});

mongoose.model('todoRates', todoRatesSchema);