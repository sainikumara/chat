var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/choose-channel.html', function(req, res) {
  res.sendFile(__dirname + '/choose-channel.html');
});

app.get('/channel.html', function(req, res) {
  res.sendFile(__dirname + '/channel.html');
});

app.get('/css/style.css', function(req, res) {
  res.sendFile(__dirname + '/css/style.css');
});

app.get('/css/chat-style.css', function(req, res) {
  res.sendFile(__dirname + '/css/chat-style.css');
});

app.get('/js/login.js', function(req, res) {
  res.sendFile(__dirname + '/js/login.js');
});

app.get('/js/choose-channel.js', function(req, res) {
  res.sendFile(__dirname + '/js/choose-channel.js');
});

app.get('/js/channel.js', function(req, res) {
  res.sendFile(__dirname + '/js/channel.js');
});

var disconnectionListener = function() {
    console.log('a user disconnected');
};

var messageListener = function(msg) {
  console.log('message' + msg);
}

var messageEmitter = function(msg) {
  io.emit('message', msg);
};

var connectionListener = function(socket ) {
  console.log('a user connected');

  socket.on('disconnect', disconnectionListener);
  socket.on('message', messageListener);
  socket.on('message', messageEmitter);
};

io.on('connection', connectionListener);

http.listen(3000, function() {
  console.log('listening on *:3000');
});
