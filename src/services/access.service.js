'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../utils/authUtil');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../utils/customError');

const RoleShop = {
	SHOP: '00000',
	WRITER: '0001',
	EDITOR: '0002',
	ADMIN: '0003',
};

class AccessService {
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
			const privateKey = crypto.randomBytes(64).toString('hex');
			const publicKey = crypto.randomBytes(64).toString('hex');

			const publicKeyString = await KeyTokenService.createToken({
				userId: newShop._id,
				publicKey,
				privateKey,
			});

			if (!publicKeyString) {
				return {
					code: '500',
					error: 'publicKeyString error',
				};
			}

			// for rsa generatingkeys  function
			// const publicKeyObject = crypto.createPublicKey(publicKey);

			const tokens = await createTokenPair(
				{ userId: newShop._id, email: newShop.email },
				publicKey,
				privateKey
			);
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
}

module.exports = AccessService;
