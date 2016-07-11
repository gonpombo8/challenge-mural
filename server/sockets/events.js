'use strict';
module.exports = socketEvents;

var cookie = require('cookie');

function socketEvents (io) {
	var scrollStructure = {};
	
	io.on('connection', (socket) => {
		console.log("Socket %s connected", socket.id);
		
		socket.on('scrollChange', (scrollData) => {
			console.log("Socket %s update scroll page of room %s: %s", socket.id, socket.room, scrollData.percentage);
			socket.cookies = cookie.parse(socket.request.headers.cookie);
			if(!socket.cookies.username) socket.emit('error', 'Auth error');
			if(!socket.room) joinRoom(scrollData.room);
			scrollStructure[socket.room] = scrollData.percentage;
			socket.broadcast.to(socket.room).emit('updateSroll', {percentage: scrollData.percentage, username: socket.cookies.username});
		});

		socket.on('room', (room) => {
			if(socket.room) socket.leave(socket.room);
			joinRoom(room);
			let roomSessions = io.sockets.adapter.rooms[room].length;
			if(roomSessions > 1) socket.emit('updateSroll', scrollStructure[room] || 0);
		});

		socket.on('disconnect', () => {
			console.log("Socket %s disconnected", socket.id);
		});

		socket.on('error', (error) => {
			console.log("[ERROR][SOCKET]", error)
		});

		function joinRoom(room) {
			socket.room = room;
			socket.join(room);
		}
	});
}