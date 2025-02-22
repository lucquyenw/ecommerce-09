const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
	{
		inven_productId: { type: Schema.ObjectId, ref: 'Product' },
		inven_location: { type: String, default: 'unknown' },
		inven_stock: { type: Number, required: true },
		inven_shopId: { type: Schema.ObjectId, ref: 'Shop' },
		inven_reservations: { type: Array, default: [] },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
