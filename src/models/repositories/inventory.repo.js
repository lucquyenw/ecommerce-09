const { Types } = require('mongoose');
const inventoryModel = require('../inventory.model');

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
