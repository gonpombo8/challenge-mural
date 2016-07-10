module.exports = socketConfig;

function socketConfig(io) {
	require('./middlewares')(io);
	require('./events')(io);
}