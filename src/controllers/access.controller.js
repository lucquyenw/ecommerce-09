'use strict';

const AccessService = require('../services/access.service');

class AccessController {
	signUp = async (req, res, next) => {
		try {
			const { name, email, password } = req.body;

			const result = await AccessService.signUp({ name, email, password });
			res
				.status(result.code)
				.json({ message: result.message, data: result.metadata });
		} catch (error) {
			next(error);
		}
	};
}

module.exports = new AccessController();
