$('body').append("<div id='sonos-container' />")

var scripts = document.getElementsByTagName("script");
var statusUrl = scripts[scripts.length-1].src + '/status';

var update = (function() {
  $.ajax({
    url: statusUrl,
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    success: function(d) {
      $('#sonos-container').html(d);
    }
  });
});

setInterval(update, 15000);
update();
