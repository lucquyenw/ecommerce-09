'use strict';

const { Types } = require('mongoose');
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

	static findByUserId = async (userId) => {
		return await keyTokenModel
			.findOne({ user: new Types.ObjectId(userId) })
			.lean();
	};

	static removeKeyById = async (id) => {
		return await keyTokenModel.deleteOne(id);
	};

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await keyTokenModel
			.findOne({ usedRefreshTokens: refreshToken })
			.lean();
	};

	static findByRefreshToken = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshToken });
	};
}

module.exports = KeyTokenService;
