var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var User = mongoose.model('users');
mongoose.connect('mongodb://localhost/winewhine');

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
 