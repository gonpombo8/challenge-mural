module.exports = socketConfig;

function socketConfig (io) {
	var scrollTest = {};
	io.on('connection', (socket) => {
		console.log("Socket %s connected", socket.id);
		
		socket.on('scrollChange', (scrollData) => {
			if(!socket.room) joinRoom(scrollData.room);
			// console.log("Socket %s update scroll page of room %s: %s", socket.id, socket.room, scrollData.percentage);
			scrollTest[socket.room] = scrollData.percentage;
			socket.broadcast.to(socket.room).emit('updateSroll', scrollData.percentage);
		});

		socket.on('room', (room) => {
			if(socket.room)
				socket.leave(socket.room);
			joinRoom(room);
			let roomSessions = io.sockets.adapter.rooms[room].length;
			if(roomSessions > 1) {
				console.log("Entro.")
				socket.emit('updateSroll', scrollTest[room] || 0);
			}
		});

		socket.on('disconnect', () => {
			console.log("Socket %s disconnected", socket.id);
		});

		function joinRoom(room) {
			socket.room = room;
			socket.join(room);
		}
	});
}