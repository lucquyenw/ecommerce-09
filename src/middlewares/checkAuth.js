'use strict';

const APIKeyService = require('../services/apiKey.service');
const { CustomError, FobiddenError } = require('../utils/customError');

const HEADER = {
	API_KEY: 'x-api-key',
	AUTHORiZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
	const key = req.headers[HEADER.API_KEY]?.toString();

	if (!key) {
		throw new FobiddenError();
	}

	const apiKey = await APIKeyService.findById(key);
	if (!apiKey) {
		throw new FobiddenError();
	}

	req.objKey = apiKey;
	return next();
};

const checkPermisison = (permission) => {
	return (req, res, next) => {
		if (!req.objKey.permissions) {
			throw new FobiddenError('Permission denied');
		}
		if (req.objKey.permissions.some((p) => p === permission)) {
			return next();
		}

		throw new FobiddenError('Permission denied');
	};
};

module.exports = {
	apiKey,
	checkPermisison,
};
