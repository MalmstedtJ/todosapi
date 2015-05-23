var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = process.env.MONGO_USER;
var pass = process.env.MONGO_PASS;

mongoose.connect('mongodb://'+user+':'+pass+'@ds029317.mongolab.com:29317/todosdb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wine Wine' });
});



// router.get('/user', function(req, res) {
//     res.render('addUser');
// });
// router.get('/user/remove', function(req, res) {
//     res.render('removeUser');
// });


module.exports = router;
 