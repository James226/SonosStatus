var http = require('http');
var fs = require('fs');
var Sonos = require('sonos').Sonos;
var request = require('request')
var Url = require('url')

var sonos = new Sonos('192.168.4.85', 1400);

var server = http.createServer(function (req, response) {
  if (req.url === '/') {
    fs.readFile('./client.js', function(err, data) {
      response.end(data);
    });
  } else {
    var url = Url.parse(req.url, true);
    response.writeHead(200, {"Content-Type": "application/javascript"});
    sonos.currentTrack(function(err, track) {
      request({ url: track.albumArtURL, encoding: 'binary'}, function(err, res, body) {
        fs.readFile('./template.html', function(err, data) {
  	      data = new String(data).replace(/(\r\n|\n|\r)/gm, '')
  	      data = data.replace(/\{([a-zA-Z\-]+)\}/gm, function(match, capture) {
            if (capture === 'album-art') {
              return 'data:image/gif;base64,' + new Buffer(body.toString(), 'binary').toString('base64');
            } else {
              return track[capture];
            }
          });
          response.end(url.query.callback + '(\'' + data.replace('\'', '\\\'') + '\')');
        });
      });
    });
  }
});

server.listen(8000);

console.log("Server started");
