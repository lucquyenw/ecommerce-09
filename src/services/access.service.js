'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../utils/authUtil');
const { getInfoData } = require('../utils');
const {
	BadRequestError,
	NotFoundError,
	CustomError,
	AuthenticationError,
	FobiddenError,
} = require('../utils/customError');
const { findByEmail } = require('./shop.service');
const { token } = require('morgan');

const RoleShop = {
	SHOP: '00000',
	WRITER: '0001',
	EDITOR: '0002',
	ADMIN: '0003',
};

const generateKeys = () => {
	const privateKey = crypto.randomBytes(64).toString('hex');
	const publicKey = crypto.randomBytes(64).toString('hex');

	return { privateKey, publicKey };
};

class AccessService {
	static logIn = async ({ email, password, refreshToken }) => {
		const foundShop = await findByEmail({ email });
		if (!foundShop) {
			throw new NotFoundError(`shop doesn't exist`);
		}

		const isPasswordMatch = await bcrypt.compare(password, foundShop.password);
		if (!isPasswordMatch) {
			throw new AuthenticationError();
		}

		const { publicKey, privateKey } = generateKeys();

		const tokens = await createTokenPair(
			{ userId: foundShop._id, email: foundShop.email },
			publicKey,
			privateKey
		);

		await KeyTokenService.createToken({
			userId: foundShop._id,
			publicKey,
			privateKey,
			refreshToken: tokens.refreshToken,
		});

		return {
			code: 200,
			metadata: {
				shop: getInfoData({
					fields: ['_id', 'name', 'email'],
					object: foundShop,
				}),
				tokens,
			},
		};
	};

	static signUp = async ({ name, email, password }) => {
		// step 1: check email exist
		const holderShop = await shopModel.findOne({ email }).lean();
		if (holderShop) {
			throw new BadRequestError('this email is registered!');
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const newShop = await shopModel.create({
			name,
			email,
			password: hashedPassword,
			roles: [RoleShop.SHOP],
		});

		if (newShop) {
			// created privateKey, publicKey.
			// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			// 	modulusLength: 4096,
			// 	publicKeyEncoding: {
			// 		type: 'pkcs1',
			// 		format: 'pem',
			// 	},
			// 	privateKeyEncoding: {
			// 		type: 'pkcs1',
			// 		format: 'pem',
			// 	},
			// });

			//apply simpler version for generating public and private keys
			const { publicKey, privateKey } = generateKeys();

			// for rsa generatingkeys  function
			// const publicKeyObject = crypto.createPublicKey(publicKey);

			const tokens = await createTokenPair(
				{ userId: newShop._id, email: newShop.email },
				publicKey,
				privateKey
			);

			await KeyTokenService.createToken({
				userId: newShop._id,
				publicKey,
				privateKey,
				refreshToken: tokens.refreshToken,
			});

			return {
				code: 201,
				metadata: {
					shop: getInfoData({
						fields: ['_id', 'name', 'email'],
						object: newShop,
					}),
					tokens,
				},
			};
		}

		return {
			code: 200,
			metadata: null,
		};
	};

	static logout = async (keyToken) => {
		return await KeyTokenService.removeKeyById(keyToken._id);
	};

	static handleRefreshToken = async (refreshToken) => {
		const foundToken = await KeyTokenService.findByRefreshTokenUsed(
			refreshToken
		);

		if (foundToken) {
			const { userId, email } = await verifyJWT(
				refreshToken,
				foundToken.privateKey
			);
			console.log({ userId, email });
			await KeyTokenService.removeKeyById(foundToken._id);
			throw new FobiddenError('something wrong happened, please re-login');
		}

		const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
		if (!holderToken) {
			throw new FobiddenError('something wrong happened, please re-login');
		}

		const { userId, email } = await verifyJWT(
			refreshToken,
			holderToken.privateKey
		);
		const foundShop = await findByEmail({ email });
		if (!foundShop) throw new AuthenticationError('Shop is not registered');

		const tokens = await createTokenPair(
			{ userId: foundShop._id, email: foundShop.email },
			holderToken.publicKey,
			holderToken.privateKey
		);

		await holderToken.updateOne({
			$set: {
				refreshToken: tokens.refreshToken,
			},
			$addToSet: {
				usedRefreshTokens: refreshToken,
			},
		});
		return {
			status: 200,
			metadata: {
				shop: getInfoData({
					fields: ['_id', 'name', 'email'],
					object: foundShop,
				}),
				tokens,
			},
		};
	};
}

module.exports = AccessService;
