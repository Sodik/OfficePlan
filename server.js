var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

function server(router, handlers){
  http.createServer(function(request, response){
    var pathName = url.parse(request.url).pathname;
    var tmp  = pathName.lastIndexOf('.');
    var extension  = pathName.substring((tmp + 1));
    var filePath = path.join(__dirname, pathName);
    switch(extension){
      case 'css':
        response.writeHeader(200, {'Content-Type': 'text/css'});
        break;
      case 'js':
        response.writeHeader(200, {'Content-Type': 'text/javascript'});
        break;
      case 'png':
        response.writeHeader(200, {'Content-Type': 'image/png'});
        break;
      case 'jpeg':
        response.writeHeader(200, {'Content-Type': 'image/jpeg'});
        break;
      case 'jpg':
        response.writeHeader(200, {'Content-Type': 'image/jpg'});
        break;
      case 'html':
        response.writeHeader(200, {'Content-Type': 'text/html'});
        break;
      default:
        router(handlers, pathName, response);
        return;
    }
    fs.readFile(filePath, 'utf-8', function(err, content){
      if(err){
        return console.log(err);
      }
      response.end(content, 'utf-8');
    });
  }).listen(8080);
}

module.exports = server;