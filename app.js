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

io.on('connection', (socket) => {
	console.log("Socket %s connected", socket.id);
	
	socket.on('disconnect', () => {
		console.log("Socket %s disconnected", socket.id);
	});

	socket.on('scroll', (height) => {
		console.log("Socket %s update scroll page %s", socket.id, height);
		socket.broadcast.emit('updateSroll', height);
	})
});