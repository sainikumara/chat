

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
      // save nickname to session storage:
      if (typeof Storage !== "undefined") {
        // Checking localStorage & sessionStorage support
        sessionStorage.nickname = nick;
      }
      else {
        // Sorry, no local storage support
      }
      
      
      // redirecting to the page for choosing the first channel to join
      window.location.href = 'choose-channel.html';
    }

    return false;
  });
});

//Check that the nickname is not in use
//Save nickname for further use