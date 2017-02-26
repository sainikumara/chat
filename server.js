var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Chatlog.db');
db.serialize();
db.run('CREATE TABLE IF NOT EXISTS Chatlog (channel TEXT, nick TEXT, message TEXT, time TEXT)');
var insertMessage = db.prepare('INSERT INTO Chatlog VALUES (?, ?, ?, ?)');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/channel.html', function (req, res) {
  res.sendFile(__dirname + '/channel.html');
});

app.get('/css/style.css', function (req, res) {
  res.sendFile(__dirname + '/css/style.css');
});

app.get('/css/chat-style.css', function (req, res) {
  res.sendFile(__dirname + '/css/chat-style.css');
});

app.get('/js/login.js', function (req, res) {
  res.sendFile(__dirname + '/js/login.js');
});

app.get('/js/channel.js', function (req, res) {
  res.sendFile(__dirname + '/js/channel.js');
});

var disconnectionListener = function () {
  console.log('a user disconnected');
};

// Getting a timestamp and changing it into a nicer form
function createTimestamp() {
  return new Date().toISOString().substr(11, 8);
}



var messageEmitter = function (msg) {
  msg['t'] = createTimestamp();
  insertMessage.run(msg['c'], msg['n'], msg['m'], msg['t']);
  io.emit('message', msg);
};

var historyFromDb = function (emitter) {
  var messageLog = [];
  var completeCallback = function() {
    emitter(messageLog);
  }

  db.each('SELECT channel, nick, message, time FROM Chatlog', function(err, row) {
    var msg = {'c': row.channel, 'n': row.nick, 'm': row.message, 't': row.time};
    messageLog.push(msg);
  }, completeCallback);
  console.log('1', messageLog);
}

var connectionListener = function (socket) {
  console.log('a user connected');

  var historyEmitter = function (messageLog) {
    console.log('2', messageLog);
    var history = JSON.stringify(messageLog);
    console.log('3', history);
    socket.emit('history', history);
  }

  var history = function() {
    historyFromDb(historyEmitter);
  }

  socket.on('disconnect', disconnectionListener);
  socket.on('history', history);
  socket.on('message', messageEmitter);
};

io.on('connection', connectionListener);

http.listen(3000, function () {
  console.log('listening on *:3000');
});
