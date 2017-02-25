$(document).ready(function() {
  var currentChannel = sessionStorage.getItem("currentChannel");
  var channels = [];

  // Getting the list of channels from the browser session storage and showing it to the user
  listChannels();

  function listChannels() {
    channels = JSON.parse(sessionStorage.channels);
    var container = $("<ul class='container'>");

    channels.forEach(function(chan) {
      if(chan === sessionStorage.getItem("currentChannel")) {
        container.append($("<li id='current'>").text(chan));
      } else {
        var element =$("<li>").text(chan);
        container.append(element);

        // Clicking a channel name makes it the current channel
        var clickHandler = function() {
          sessionStorage.currentChannel = chan;
          window.location.reload();
        };
        element.click(clickHandler);
      }
    });
    $("#channels").empty();
    $("#channels").append(container);
  }

  // Join a new channel
  $('#channelChooser').submit(function() {
    var $channel_input = $("#c");
    var channel = $channel_input.val();

    if( channel !== '' && !channels.includes(channel)) {
      channels.push(channel);
      sessionStorage.channels = JSON.stringify(channels);
    }
    $('#c').val('');
    // Showing the updated list of channels
    listChannels();
    return false;
  });

  // Object for contacting the server
  var socket = io();

  // Request for history through socket
  historyRequest();

  function historyRequest() {
    socket.emit('history', 'please');
    socket.on('history', showLog);
  }

  function showLog(history) {
    var messageLog = JSON.parse(history);
    messageLog.forEach(function(o) {
      messageToChannel(o);
    });
  }

  // Emitting a message from the chat form to the server
  $('#chat').submit(function() {
    var nick = sessionStorage.getItem("nickname");
    var message = $('#m').val();
    var o = {'c': currentChannel, 'n': nick, 'm': message};
    socket.emit('message', o);
    $('#m').val('');
    return false;
  });

  // Listening, receiving and showing messages that are received from the server
  socket.on('message', messageToChannel);

  function messageToChannel(o) {
    if (currentChannel === o['c']) {
      var niceMessage = presentableMessage(o);
      $('#messages').append($('<li>').text(niceMessage));
    }
  }

  function presentableMessage(o) {
      var timestamp = o['t'];
      var nick = o['n'];
      var message = o['m'];
      var niceMessage = timestamp + " <" + nick + "> " + message;
      return niceMessage;
  }

});
