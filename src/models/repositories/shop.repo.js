const shopModel = require('../shop.model');

const findShopById = async (id) => {
	return await shopModel.findById(id).lean();
};

module.exports = {
	findShopById,
};
