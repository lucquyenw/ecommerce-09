'use strict';

const mongoose = require('mongoose');
const os = require('os');
const _SECONDS = 5000;

const countConnect = () => {
	const numConnection = mongoose.connections.length;
	console.log(`Number of Connections: ${numConnection}`);
};

//check over load
const checkOverload = () => {
	setInterval(() => {
		const numConnection = mongoose.connections.length;
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;
		// Example maximum number of connections based on number of cores
		const maxConnection = numCores * 5;

		console.log(`Active connection ${numConnection}`);
		console.log(`${memoryUsage / 1024 / 1024} kb`);

		if (numConnection > maxConnection) {
			console.log('Connection overload expected');
		}
	}, _SECONDS);
};

module.exports = {
	countConnect,
	checkOverload,
};
