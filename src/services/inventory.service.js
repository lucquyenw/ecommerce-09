'use strict';

const { findProduct } = require('../models/repositories/product.repo');

class InventoryService {
	static async addStockToInventory({
		stock,
		productId,
		shopId,
		location = '1234, Tran Phu, Ho Chi Minh',
	}) {
		const product = await findProduct({ productId });

		if (!product) {
			throw new BadRequestError('product does not exist');
		}

		const query = { inven_shopId: shopId, inven_productId: productId };

		const updateSet = {
				$inc: {
					inven_stock: stock,
				},
				$set: {
					inven_location: location,
				},
			},
			options = { upsert: true, new: true };

		return await inventory.findOneAndUpdate(query, updateSet, options);
	}
}

module.exports = InventoryService;
