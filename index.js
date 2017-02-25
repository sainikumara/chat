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

// Getting a timestamp and changing it into a nicer form
function createTimestamp() {
  var str = "";
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  str += hours + ":" + minutes + ":" + seconds + " ";
  return str;
}

var messageLog = [];

var messageEmitter = function(o) {
  o['t'] = createTimestamp();
  messageLog.push(o);
  io.emit('message', o);
};

var historyEmitter = function() {
  var history = JSON.stringify(messageLog);
  io.emit('history', history);
}

var connectionListener = function(socket ) {
  console.log('a user connected');
  socket.on('disconnect', disconnectionListener);
  socket.on('history', historyEmitter);
  socket.on('message', messageEmitter);
};

io.on('connection', connectionListener);

http.listen(3000, function() {
  console.log('listening on *:3000');
});
