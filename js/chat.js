var Chat = {};

// Get the list of channels from the browser session storage and show it to the user
Chat.drawChanList = function () {
  var channels = [];
  var json = sessionStorage.getItem('channels');

  try {
    channels = JSON.parse(json);
    if (channels === null) {
      return false;
    }
  }
  catch (e) {
    return false;
  }

  var chanList = $('<ul>').addClass('chanList');

  channels.forEach(function (chan) {
    // Leave a channel by clicking the ✖ left to its name
    var close = $('<span class="close">').text('✖').click(function () {
      var i = channels.indexOf(chan);

      if (i > -1) {
        channels.splice(i, 1);
        sessionStorage.setItem('channels', JSON.stringify(channels));
        if (chan === sessionStorage.getItem('currentChannel')) {
          sessionStorage.removeItem('currentChannel');
        }
      }
      window.location.reload();
    });

    // Change to another channel by clicking its name on the channel list
    var name = $('<span class="channelName">').text(chan).click(function () {
      sessionStorage.setItem('currentChannel', chan);
      window.location.reload();
    });

    var listItem = $('<li>');

    // Add the attribute needed to indicate the current channel
    if (chan === sessionStorage.getItem('currentChannel')) {
      listItem.attr('id', 'current');
    }

    chanList.append(
      listItem.append(close).append(' ').append(name)
    );
  });
  // Update the channel list showed to the user
  $('#channels').empty()
  $('#channels').append(chanList);
}

Chat.channelNameValidityChecker = function (channelName) {
  if (typeof channelName === 'string' && 1 <= channelName.length && channelName.length <= 20 && !/[^#a-z0-9]/i.test(channelName)) {
    return 1;
  }
}

Chat.joinChannel = function () {
  var $channel_input = $('#c');
  var channel = $channel_input.val();

  if (Chat.channelNameValidityChecker(channel) !== 1) {
    return false;
  } else {

    var channels = [];
    var json = sessionStorage.getItem('channels');

    try {
      channels = JSON.parse(json);
      if (channels === null) {
        channels = [];
        sessionStorage.setItem('channels', JSON.stringify(channels));
      }
    }
    catch (e) {
      channels = [];
      sessionStorage.setItem('channels', JSON.stringify(channels));
    }

    if (channel !== '' && jQuery.inArray(channel, channels) === -1) {
      channels.push(channel);
      sessionStorage.setItem('channels', JSON.stringify(channels));

      if (!sessionStorage.getItem('currentChannel')) {
        sessionStorage.setItem('currentChannel', channel);
        window.location.reload();
      }
    }
    $('#c').val('');

    // Show the updated list of channels
    Chat.drawChanList();
  }

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
  if (sessionStorage.getItem('currentChannel')) {
    if (sessionStorage.getItem('currentChannel') === msg['c']) {
      var niceMessage = Chat.presentableMessage(msg);
      $('#messages').append($('<li>').text(niceMessage));
    }
  }
}

Chat.buildMessage = function () {
  var nick = localStorage.getItem('nickname');
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
  try {
    window.sessionStorage
  } catch (e) {
    window.location.href = '/error.html';
  }

  var channels = [];
  var socket = io();

  if (!localStorage.getItem('nickname')) {
    window.location.href = '/login.html';
  }

  // Request for history through socket
  socket.emit('history', 'please');
  socket.on('history', Chat.showLog);

  Chat.drawChanList();

  $('#channelChooser').submit(Chat.joinChannel);

  // Emit a message from the chat form to the server
  $('#chat').submit(function () {
    var msg = Chat.buildMessage();
    socket.emit('message', msg);
    return false;
  });

  // Listen, receive and show messages that are received from the server
  socket.on('message', Chat.messageToChannel);
};

$(document).ready(Chat.main);
