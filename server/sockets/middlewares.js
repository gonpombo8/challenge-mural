'use strict';
module.exports = middlewares;

var cookie = require('cookie');

function middlewares(io) {
	io.use((socket, next) => {
		socket.cookies = cookie.parse(socket.request.headers.cookie);
		next();
	});

	io.use((socket, next) => {
		if(!socket.cookies.username) {
			return next(new Error("Auth error"));
		}
		next();
	});
}