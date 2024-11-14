'use strict';

const InventoryService = require('../services/inventory.service');

class InventoryController {
	addStockToInventory = async (req, res, next) => {
		return res.status(200).json({
			message: 'add stock to inventory success',
			metadata: await InventoryService.addStockToInventory(req.body),
		});
	};
}

module.exports = new InventoryController();
