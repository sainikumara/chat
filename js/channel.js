

$(document).ready(function() {

  var socket = io();

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

  $('form').submit(function() {
    var timestamp = createTimestamp();
    var nick = sessionStorage.getItem("nickname");
    var nickAndMessage = timestamp + " <" + nick + "> " + $('#m').val();
    socket.emit('message', nickAndMessage);
    $('#m').val('');
    return false;
  });

  socket.on('message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

});
