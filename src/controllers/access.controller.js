'use strict';

const AccessService = require('../services/access.service');

class AccessController {
	signUp = async (req, res, next) => {
		const { name, email, password } = req.body;

		const result = await AccessService.signUp({ name, email, password });
		res
			.status(result.code)
			.json({ message: result.message, data: result.metadata });
	};
}

module.exports = new AccessController();
