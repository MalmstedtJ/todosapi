var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./routes/authenticate');
var routes = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');
var images = require('./routes/images');
var mongoose = require('mongoose');
var tokenauth = require('./models/tokenauth');
var fs = require('fs');
var http = require("http");

var allowCrossDomain = function(req, res, next) {
  console.log("setting headers");
  //res.header('Access-Control-Allow-Origin', 'http://development.vsjgis-app.divshot.io');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  next();
}
var app = express();

// var server = http.createServer(app);
// server.listen(3000);
// var WebSocketServer = require('ws').Server
//   , wss = new WebSocketServer({server: server});



// wss.on('connection', function(ws) {
//   console.log("Connected");
//     ws.on('message', function(message) {
//         console.log('received: %s', message);
//     });
//     ws.send("Welcome");
// });

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

   app.set('ws', wss);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
// server = require('http').createServer(app);
// io = require('socket.io').listen(server);
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

//io.set('transports', ['xhr-polling']);
//io({transports: ['xhr-polling']});

//app.set('io', io);

// io.on('connection', function(socket){
//   socket.broadcast.emit('event', "A user connected");
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//   // socket.on('chat message', function(msg){
//   //   io.emit('chat message', msg);
//   //   console.log('message: ' + msg);
//   // });
// });

// server.listen(3000, function(){
//   console.log('listening on *:3000');
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('secret', process.env.MONGO_SECRET || 'ThisIsADevSecret');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename){
  if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
  });

app.use('/authenticate', auth);

app.use('/', routes);

//All routes after this will require token authentication
app.use(function(req, res, next){
  tokenauth.Authenticate(req, res, next);
});

app.use('/users', users);
app.use('/todos', todos);
app.use('/images', images);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
if(process.env.MONGO_ENV === 'PROD')
{
  console.log('Environment: Production')
  mongoose.connect(process.env.MONGO_CONN_STRING);
}

// development error handler
// will print stacktrace
else if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  console.log('Environment: Development')
  mongoose.connect('mongodb://localhost:27017/winewhine');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
