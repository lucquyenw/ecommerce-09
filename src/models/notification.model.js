'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'notification';
const COLLECTION_NAME = 'notifications';

// ORDER-001: order sucessfully
// ORDER-002: order failed
// PROMOTION-001: new  PROMOTION
// SHOP-001: new product by user following

const notificationSchema = new Schema(
	{
		noti_type: {
			type: String,
			enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
			required: true,
		},
		noti_senderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Shop',
		},
		noti_receiverId: {
			type: Number,
			required: true,
		},
		noti_content: {
			type: String,
			required: true,
		},
		noti_options: {
			type: Object,
			default: {},
		},
	},
	{
		collection: COLLECTION_NAME,
		timestamps: true,
	}
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
