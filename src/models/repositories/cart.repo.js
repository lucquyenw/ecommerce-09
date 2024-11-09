const { getUnSelectData } = require('../../utils');
const cartModel = require('../cart.model');

const findCart = async ({ filter, unSelect }) => {
	return await cartModel.findOne(filter).select(getUnSelectData(unSelect));
};

const createOrUpdateCart = async ({ query, update, option }) => {
	return await cartModel.findOneAndUpdate(query, update, option);
};

const updateOne = async ({ query, update }) => {
	return await cartModel.updateOne(query, update);
};

const findCartById = async ({ id }) => {
	return await cartModel.findById(id).lean();
};

module.exports = {
	findCart,
	createOrUpdateCart,
	updateOne,
	findCartById,
};
