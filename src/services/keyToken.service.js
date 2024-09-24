'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
	static createToken = async ({
		userId,
		publicKey,
		privateKey,
		refreshToken,
	}) => {
		try {
			const token = await keyTokenModel.findOneAndUpdate(
				{ user: userId },
				{
					publicKey,
					privateKey,
					usedRefreshTokens: [],
					refreshToken,
				},
				{ upsert: true, new: true }
			);

			return token ? token.publicKey : null;
		} catch (error) {
			return error;
		}
	};
}

module.exports = KeyTokenService;
