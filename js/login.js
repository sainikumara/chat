$(document).ready(function() {
  $('form').submit(function() {

    var $nick_input = $('#nick');
    var nick = $nick_input.val();

    // Checking for blank field.
    if( nick == '') {
      $('input[type="text"],input[type="nickname"]').css('border','2px solid red');
      alert("Choose a nickname to enter");
    } else {
      //FIXME send nick to server, get back information on if it is already in use

      // Checking localStorage & sessionStorage support
      if (typeof Storage !== 'undefined') {
        sessionStorage.setItem('nickname', nick);
        window.location.href = 'channel.html';
      }
      else {
        // FIXME: Sorry, no local storage support
      }
    }
    return false;
  });
});

//FIXME: Check that the nickname is not in use
