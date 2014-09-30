var server = require('./server');
var router = require('./router')
var requestHandlers = require('./requestHandlers');

var handlers = {
  '/': requestHandlers.home,
  '/data': requestHandlers.data
}

server(router, handlers);