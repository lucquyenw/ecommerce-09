'use strict';

const JWT = require('jsonwebtoken');
const asyncErrorHandler = require('./asyncErrorHandler');
const { AuthenticationError, NotFoundError } = require('./customError');
const KeyTokenService = require('../services/keyToken.service');
const HEADER = {
	API_KEY: 'x-api-key',
	CLIENT_ID: 'x-client-id',
	AUTHORiZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
	try {
		//create access token
		const accessToken = JWT.sign(payload, publicKey, {
			expiresIn: '2 days',
		});

		const refreshToken = JWT.sign(payload, privateKey, {
			expiresIn: '7 days',
		});

		JWT.verify(accessToken, publicKey, (err, decode) => {
			if (err) {
				console.error('error verify' + err);
			} else {
				console.log('decode', decode);
			}
		});
		return { accessToken: accessToken, refreshToken };
	} catch (error) {
		return {
			error,
		};
	}
};

const authentication = asyncErrorHandler(async (req, res, next) => {
	const userId = req.headers[HEADER.CLIENT_ID];
	if (!userId) throw new AuthenticationError('Invalid Request');

	const keyToken = await KeyTokenService.findByUserId(userId);
	if (!keyToken) {
		throw new NotFoundError('Not Found Key Token');
	}

	const accessToken = req.headers[HEADER.AUTHORiZATION];
	if (!accessToken) throw new AuthenticationError('Invalid request');

	try {
		const decodedUser = JWT.verify(accessToken, keyToken.publicKey);

		if (userId !== decodedUser.userId)
			throw new AuthenticationError('Invalid UserId');
		req.keyToken = keyToken;
		req.user = decodedUser;
		next();
	} catch (error) {
		throw new AuthenticationError('unauthentication error');
	}
});

const verifyJWT = async (token, keySecret) => {
	return await JWT.verify(token, keySecret);
};

module.exports = {
	createTokenPair,
	authentication,
	verifyJWT,
};
