'use strict';

const AccessService = require('../services/access.service');

class AccessController {
	logIn = async (req, res, next) => {
		const { name, email, password } = req.body;

		const result = await AccessService.logIn({ name, email, password });
		return res
			.status(result.code)
			.json({ message: result.message, data: result.metadata });
	};

	signUp = async (req, res, next) => {
		const { name, email, password } = req.body;

		const result = await AccessService.signUp({ name, email, password });
		return res
			.status(result.code)
			.json({ message: result.message, data: result.metadata });
	};
}

module.exports = new AccessController();
