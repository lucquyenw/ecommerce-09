const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
	{
		cart_state: {
			type: String,
			required: true,
			enums: ['active', 'completed', 'failed', 'pending'],
			default: 'active',
		},
		cart_products: { type: Array, required: true, default: [] },
		cart_count_product: { type: Number, default: 0 },
		cart_userId: { type: Number, required: true },
	},
	{
		collection: COLLECTION_NAME,
		timestamps: {
			createdAt: 'createdOn',
			updatedAt: 'updatedOn',
		},
	}
);

module.exports = model(DOCUMENT_NAME, cartSchema);
