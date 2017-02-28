$(document).ready(function () {
  try {
    window.localStorage
  } catch (e) {
    window.location.href = '/error.html';
  }

  $('form').submit(function () {

    var $nick_input = $('#nick');
    var nick = $nick_input.val();

    var nickValidityChecker = function () {
      if (typeof nick === 'string' && 1 <= nick.length && nick.length <= 20 && !/[^a-z0-9]/i.test(nick)) {
        return true;
      } else {
        return false;
      }
    }

    if (!nickValidityChecker()) {
      $('#nick').css('border', '2px solid red');
      $('label').css('color', '#f20202');
    } else {
      //Send nick to server to check if it is already in use
      var socket = io();
      socket.emit('nick', nick);

      var approveNick = function (reply) {
        socket.removeListener('nickOK', approveNick);
        if (reply === 'isOk') {
          localStorage.setItem('nickname', nick);
          window.location.href = '/';
        } else {
          $('#nick').css('border', '2px solid red');
          alert('Sorry, nickname already in use. Try another one.');
        }
      };

      // Receive the reply from the server
      socket.on('nickOK', approveNick);
    }
    return false;
  });

});
