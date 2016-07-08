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

var scrollTest = {};
io.on('connection', (socket) => {
	console.log("Socket %s connected", socket.id);
	
	socket.on('disconnect', () => {
		console.log("Socket %s disconnected", socket.id);
	});

	socket.on('room', (room) => {
		//Leave old room.
		if(socket.room) 
			socket.leave(socket.room);
		//Join new room.
		socket.room = room;
		socket.join(room);
		//If there was a session, join with scroll session.
		let sessionsLength = io.sockets.adapter.rooms[room].length;
		if(sessionsLength > 1)
			socket.emit('updateSroll', scrollTest[room] || 0);
	});

	socket.on('scroll', (height) => {
		console.log("Socket %s update scroll page of room s: %s", socket.id, socket.room, height);
		scrollTest[socket.room] = height;
		socket.broadcast.to(socket.room).emit('updateSroll', height);
	});
});