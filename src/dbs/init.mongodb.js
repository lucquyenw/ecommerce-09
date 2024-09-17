'use strict';

const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/shopDEV';

const { countConnect } = require('../helpers/checkConnect.js');

class Database {
	constructor() {
		this.connect();
	}

	connect(type = 'mongodb') {
		if (1 === 1) {
			mongoose.set('debug', true);
			mongoose.set('debug', { color: true });
		}

		mongoose
			.connect(connectionString)
			.then((_) => console.log('Connected MongoDB Success', countConnect()))
			.catch((err) => console.log('Error Connect!'));

		mongoose.createConnection(connectionString);
		mongoose.createConnection(connectionString);
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
