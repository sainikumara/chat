$(document).ready(function () {
  $('form').submit(function () {

    var $nick_input = $('#nick');
    var nick = $nick_input.val();

    if (nick == '') {
      $('input[type="text"],input[type="nickname"]').css('border', '2px solid red');
      alert('Choose a nickname to enter');
    } else {
      //Sending nick to server to check if it is already in use
      var socket = io();
      socket.emit('nick', nick);

      var approveNick = function (reply) {
        if (reply === 'isOk') {
          // If session storage is supported, save nickname and proceed
          if (typeof Storage !== 'undefined') {
            sessionStorage.setItem('nickname', nick);
            window.location.href = 'channel.html';
          }
          else {
            // FIXME: Sorry, no local storage support
          }
        } else {
          $('input[type="text"],input[type="nickname"]').css('border', '2px solid red');
          alert('Sorry, nickname already in use. Try another one.');
        }
      };
      socket.on('nickOK', approveNick);

    }
    return false;
  });
});
