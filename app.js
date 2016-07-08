'use strict';
var express = require('express') 
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var port    = process.env.PORT || 3000;
app.use(express.static(__dirname + '/app'))

server.listen(port, () => {
	console.log('Server listening on port', port);
});

//Load socket config and events.
var socketEvents = require('./server/sockets/events')(io);

