const redisPubSubService = require('../services/redisPubSub.service');

class InventoryServiceTest {
	constructor() {
		redisPubSubService.subscibe('purchase_events', (channel, message) => {
			InventoryServiceTest.updateInventory(JSON.parse(message));
		});
	}

	static updateInventory({ productId, quantity }) {
		console.log(`update inventory ${productId} with quantity ${quantity}`);
	}
}

module.exports = InventoryServiceTest;
