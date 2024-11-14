const { Types } = require('mongoose');
const inventoryModel = require('../inventory.model');
const { convertToObjectId } = require('../../utils');

const createInventory = async ({
	productId,
	location = 'unknown',
	stock,
	shopId,
}) => {
	return await inventoryModel.create({
		inven_productId: new Types.ObjectId(productId),
		inven_location: location,
		inven_stock: stock,
		inven_shopId: new Types.ObjectId(shopId),
	});
};

const reserveInventory = async ({ productId, quantity, cartId }) => {
	const query = {
		inven_productId: convertToObjectId(productId),
		inven_stock: { $gte: quantity },
	};

	const updateSet = {
		$inc: {
			inven_stock: -quantity,
		},
		$push: {
			inven_reservations: {
				quantity,
				cartId,
				createOn: new Date(),
			},
		},
	};

	const options = { upsert: true, new: true };

	return await inventoryModel.updateOne(query, updateSet);
};

module.exports = {
	createInventory,
	reserveInventory,
};
