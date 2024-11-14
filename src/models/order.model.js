const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
	{
		order_userId: { type: Number, required: true },
		order_checkout: { type: Object, default: {} },
		/*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            freeShip
        }
    */
		order_shipping: { type: Object, default: {} },
		order_payment: { type: Object, default: {} },
		order_products: { type: Array, required: true },
		order_trackingNumber: { type: String, default: '#00000118052022' },
		order_status: {
			type: String,
			enum: ['pending', 'confirmed', 'shipped', 'cancelled'],
			default: 'pending',
		},
	},
	{
		collection: COLLECTION_NAME,
		timestamps: {
			createdAt: 'createdOn',
			updatedAt: 'modifiedOn',
		},
	}
);

module.exports = model(DOCUMENT_NAME, orderSchema);
