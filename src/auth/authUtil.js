'use strict';

const JWT = require('jsonwebtoken');
const createTokenPair = async (payload, publicKey, privateKey) => {
	try {
		//create access token
		const accessToken = JWT.sign(payload, privateKey, {
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
		return { accessTolen: accessToken, refreshToken };
	} catch (error) {
		return {
			error,
		};
	}
};

module.exports = {
	createTokenPair,
};
