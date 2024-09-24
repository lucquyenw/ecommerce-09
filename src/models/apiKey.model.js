const { Schema, model } = require('mongoose');
const { apiKeyPermissions } = require('../constants/apiKey.constant');
const DOCUMENT_NAME = 'apiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			required: true,
			enum: [
				apiKeyPermissions.Admin,
				apiKeyPermissions.editor,
				apiKeyPermissions.viewer,
			],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
