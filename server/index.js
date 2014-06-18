var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.home;
handle["/logIn"] = requestHandlers.logIn;
handle["/profile"] = requestHandlers.profile;

server.start(router.route, handle);