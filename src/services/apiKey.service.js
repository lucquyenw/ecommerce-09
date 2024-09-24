const { apiKeyPermissions } = require('../constants/apiKey.constant');
const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');

class APIKeyService {
	static findById = async (key) => {
		// const newKey = await apiKeyModel.create({
		// 	key: crypto.randomBytes(64).toString('hex'),
		// 	permissions: [apiKeyPermissions.Admin],
		// });

		const apiKey = await apiKeyModel.findOne({ key, status: true }).lean();
		return apiKey;
	};
}

module.exports = APIKeyService;
