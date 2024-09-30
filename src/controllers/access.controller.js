'use strict';

const AccessService = require('../services/access.service');

class AccessController {
	logIn = async (req, res, next) => {
		const { name, email, password } = req.body;

		const result = await AccessService.logIn({ name, email, password });
		return res.status(result.code).json(result);
	};

	logOut = async (req, res, next) => {
		const result = await AccessService.logout(req.keyToken);
		return res
			.status(200)
			.json({ message: 'logout successfully!', metadata: result });
	};

	signUp = async (req, res, next) => {
		const { name, email, password } = req.body;

		const result = await AccessService.signUp({ name, email, password });
		return res.status(result.code).json(result);
	};

	refreshToken = async (req, res, next) => {
		const { refreshToken } = req.body;
		const result = await AccessService.handleRefreshToken(refreshToken);
		return res.status(result.status).json(result);
	};
}

module.exports = new AccessController();
