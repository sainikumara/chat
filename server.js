var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicksInUse = []

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Chatlog.db');
db.serialize();
db.run('CREATE TABLE IF NOT EXISTS Chatlog (channel TEXT, nick TEXT, message TEXT, time INTEGER)');
var insertMessage = db.prepare('INSERT INTO Chatlog VALUES (?, ?, ?, ?)');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/chat.html');
});

app.use(express.static(__dirname));

var disconnectionListener = function () {
  console.log('a user disconnected');
};

var messageEmitter = function (msg) {
  msg['t'] = Date.now();
  insertMessage.run(msg['c'], msg['n'], msg['m'], msg['t']);
  io.emit('message', msg);
};

var historyFromDb = function (emitter) {
  var messageLog = [];
  var completeCallback = function () {
    emitter(messageLog);
  }

  db.each('SELECT channel, nick, message, time FROM Chatlog', function (err, row) {
    var msg = { 'c': row.channel, 'n': row.nick, 'm': row.message, 't': row.time };
    messageLog.push(msg);
  }, completeCallback);
}

var nickValidityChecker = function (nick) {
  if (typeof nick === 'string' && 1 <= nick.length && nick.length <= 20 && !/[^a-z0-9]/i.test(nick)) {
    return true;
  } else {
    return false;
  }
}

var connectionListener = function (socket) {
  console.log('a user connected');

  var nickApproval = function (nick) {
    if (nicksInUse.indexOf(nick) === -1 && nickValidityChecker(nick)) {
      nicksInUse.push(nick);
      socket.emit('nickOK', 'isOk')
    } else {
      socket.emit('nickOK', 'notOk');
    }
  }

  var historyEmitter = function (messageLog) {
    var history = JSON.stringify(messageLog);
    socket.emit('history', history);
  }

  var history = function () {
    historyFromDb(historyEmitter);
  }

  socket.on('disconnect', disconnectionListener);
  socket.on('nick', nickApproval);
  socket.on('history', history);
  socket.on('message', messageEmitter);
};

io.on('connection', connectionListener);

http.listen(3000, function () {
  console.log('listening on *:3000');
});
