var Chat = {};

// Getting the list of channels from the browser session storage and showing it to the user
Chat.drawChanList = function () {
  if (sessionStorage.getItem('channels')) {
    channels = JSON.parse(sessionStorage.getItem('channels'));
    var container = $('<ul class="container">');

    channels.forEach(function (chan) {
      if (chan === sessionStorage.getItem('currentChannel')) {
        container.append($('<li id="current">').text(chan));
      } else {
        var element = $('<li>').text(chan);
        container.append(element);

        // Clicking a channel name makes it the current channel
        var clickHandler = function () {
          sessionStorage.setItem('currentChannel', chan);
          window.location.reload();
        };
        element.click(clickHandler);
      }
    });
    $('#channels').empty();
    $('#channels').append(container);
  }
}

Chat.joinChannel = function () {
  var $channel_input = $('#c');
  var channel = $channel_input.val();

  if (!sessionStorage.getItem('channels')) {
    channels = []
    sessionStorage.setItem('channels', channels);
  }

  if (channel !== '' && jQuery.inArray(channel, channels) === -1) {
    channels.push(channel);
    sessionStorage.setItem('channels', JSON.stringify(channels));

    if (!sessionStorage.getItem('currentChannel')) {
      sessionStorage.setItem('currentChannel', channel);
    }
  }
  $('#c').val('');
  // Showing the updated list of channels
  Chat.drawChanList();
  return false;
};

Chat.presentableMessage = function (msg) {
  var timestamp = msg['t'];
  var nick = msg['n'];
  var message = msg['m'];
  var niceMessage = timestamp + ' <' + nick + '> ' + message;
  return niceMessage;
}

Chat.messageToChannel = function (msg) {
  if (sessionStorage.getItem('currentChannel') === msg['c']) {
    var niceMessage = Chat.presentableMessage(msg);
    $('#messages').append($('<li>').text(niceMessage));
  }
}

Chat.buildMessage = function () {
  var nick = sessionStorage.getItem('nickname');
  var message = $('#m').val();
  $('#m').val('');
  var msg = { 'c': sessionStorage.getItem('currentChannel'), 'n': nick, 'm': message };
  return msg;
};

Chat.showLog = function (history) {
  var messageLog = JSON.parse(history);
  messageLog.forEach(function (msg) {
    Chat.messageToChannel(msg);
  });
}

Chat.main = function () {
  var channels = [];
  var socket = io();

  if (!sessionStorage.getItem('nickname')) {
    window.location.href = '/';
  }

  // Request for history through socket
  socket.emit('history', 'please');
  socket.on('history', Chat.showLog);

  Chat.drawChanList();

  $('#channelChooser').submit(Chat.joinChannel);

  // Emitting a message from the chat form to the server
  $('#chat').submit(function () {
    var msg = Chat.buildMessage();
    socket.emit('message', msg);
    return false;
  });

  // Listening, receiving and showing messages that are received from the server
  socket.on('message', Chat.messageToChannel);
};

$(document).ready(Chat.main);
