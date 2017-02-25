

$(document).ready(function() {
  $('form').submit(function() {

    var $nick_input = $("#nick");
    var nick = $nick_input.val();

    console.log($nick_input);
    console.log(nick);

    // Checking for blank field.
    if( nick == '') {
      $('input[type="text"],input[type="nickname"]').css("border","2px solid red");

      alert("Choose a nickname to enter");
    } else {
      // Checking localStorage & sessionStorage support
      if (typeof Storage !== "undefined") {
        // save nickname to session storage:
        sessionStorage.nickname = nick;
        // redirect to the page for choosing a channel to join
        window.location.href = 'choose-channel.html';
      }
      else {
        // FIXME: Sorry, no local storage support
      }
    }
    return false;
  });
});

//FIXME: Check that the nickname is not in use
