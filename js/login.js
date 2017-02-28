$(document).ready(function () {
  try {
    window.localStorage
  } catch (e) {
    window.location.href = '/error.html';
  }

  $('form').submit(function () {

    var $nick_input = $('#nick');
    var nick = $nick_input.val();

    // Check nickname validity
    var nickValidityChecker = function () {
      if (typeof nick === 'string' && 1 <= nick.length && nick.length <= 20 && !/[^a-z0-9]/i.test(nick)) {
        return 1;
      }
    }

    if (nickValidityChecker() !== 1) {
      $('input[type="text"],input[type="nickname"]').css('border', '2px solid red');
      alert('You can use letters a-z, A-Z and numbers 0-9.\n' +
        'Minimum length is 1 character and maximum length 20 characters.');
    } else {
      //Send nick to server to check if it is already in use
      var socket = io();
      socket.emit('nick', nick);

      var approveNick = function (reply) {
        if (reply === 'isOk') {
          localStorage.setItem('nickname', nick);
          window.location.href = '/';
        } else {
          $('input[type="text"],input[type="nickname"]').css('border', '2px solid red');
          alert('Sorry, nickname already in use. Try another one.');
        }
      };

      // Receive the reply from the server
      socket.on('nickOK', approveNick);
    }
    return false;
  });

});
