

$(document).ready(function() {
  var nick = sessionStorage.getItem("nickname");
  $(".nickname").text(nick);

  // Choosing a new channel to join
  $('form').submit(function() {

    var $channel_input = $("#channel");
    var channel = $channel_input.val();

    // Checking for blank field.
    if( channel == '') {
      $('input[type="text"],input[id="channel"]').css("border","2px solid red");

      alert("Choose a channel to enter");
    } else {
      // Checking localStorage & sessionStorage support
      if (typeof Storage !== "undefined") {
        // Saving channel to session storage:
        var channels = [];
        channels.push(channel);
        sessionStorage.channels = JSON.stringify(channels);

        // Saving the new channel as the current channel in session storage
        sessionStorage.currentChannel = channel;
        // Redirect to the channel page
        window.location.href = 'channel.html';
      }
    }
    return false;
  });
});
