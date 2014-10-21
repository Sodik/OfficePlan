var server = require('./server');
var router = require('./router')
var requestHandlers = require('./requestHandlers');

var handlers = {
  '/': requestHandlers.home,
  '/data': requestHandlers.data,
  '/create': requestHandlers.create
}

server(router, handlers);