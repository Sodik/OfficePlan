var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

function server(router, handlers){
  http.createServer(function(req, res){
    var pathName = url.parse(req.url).pathname;
    var tmp  = pathName.lastIndexOf('.');
    var extension  = pathName.substring(tmp + 1);
    var filePath = path.join(__dirname, pathName);
    switch(extension){
      case 'css':
        res.writeHeader(200, {'Content-Type': 'text/css'});
        break;
      case 'js':
        res.writeHeader(200, {'Content-Type': 'text/javascript'});
        break;
      case 'png':
        res.writeHeader(200, {'Content-Type': 'image/png'});
        break;
      case 'gif':
        res.writeHeader(200, {'Content-Type': 'image/gif'});
        break;
      case 'jpeg':
        res.writeHeader(200, {'Content-Type': 'image/jpeg'});
        break;
      case 'jpg':
        res.writeHeader(200, {'Content-Type': 'image/jpg'});
        break;
      case 'html':
        res.writeHeader(200, {'Content-Type': 'text/html'});
        break;
      default:
        router(handlers, pathName, res, req);
        return;
    }
    fs.createReadStream(filePath).pipe(res)
  }).listen(8080);
}

module.exports = server;