

$(document).ready(function() {
  var nick = sessionStorage.getItem("nickname");
  $(".nickname").text(nick);

  $('form').submit(function() {

    var $channel_input = $("#channel");
    var channel = $channel_input.val();
    console.log($channel_input);
    console.log(channel);


    // Checking for blank field.
    if( channel == '') {
      $('input[type="text"],input[id="channel"]').css("border","2px solid red");

      alert("Choose a channel to enter");
    } else {
      // save channel to local storage



      window.location.href = 'channel.html';
    }

    return false;
  });
});
