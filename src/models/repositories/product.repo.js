'use strict';

const { Types } = require('mongoose');
const {
	product,
	electronic,
	clothing,
	furniture,
} = require('../../models/product.model');
const { getSelectData, getUnSelectData } = require('../../utils');
const productModel = require('../../models/product.model');

const findAllDraftForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
	return await product
		.find(query)
		.populate('product_shop', 'name email -_id')
		.sort({ updatedAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
	const foundProduct = await product.findOne({
		product_shop: new Types.ObjectId(product_shop),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundProduct) return null;

	foundProduct.isDraft = false;
	foundProduct.isPublished = true;
	const { modifiedCount } = await foundProduct.save();
	return modifiedCount;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
	const foundProduct = await product.findOne({
		product_shop: new Types.ObjectId(product_shop),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundProduct) return null;

	foundProduct.isDraft = true;
	foundProduct.isPublished = false;
	const { modifiedCount } = await foundProduct.save();
	return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
	const regexSearch = new RegExp(keySearch);
	const results = await product
		.find(
			{
				$text: { $search: regexSearch },
				isPublished: true,
			},
			{ score: { $meta: 'textScore' } }
		)
		.sort({ score: { $meta: 'textScore' } })
		.lean();
	return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const products = await product
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();

	return products;
};

const findProduct = async ({ product_id, unSelect }) => {
	return await product
		.findById(product_id)
		.select(getUnSelectData(unSelect))
		.lean();
};

const findByIdAndUpdate = async ({
	productId,
	bodyUpdate,
	model,
	isNew = true,
}) => {
	return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

const getExistedProducts = async ({ products = [] }) => {
	return Promise.all(
		products.map(async (item) => {
			const foundProduct = await product.findById(item.productId).lean();
			if (foundProduct) {
				return {
					price: foundProduct.product_price,
					quantity: item.quantity,
					productId: item.productId,
				};
			}
		})
	);
};

module.exports = {
	findAllDraftForShop,
	publishProductByShop,
	findAllPublishedForShop,
	unpublishProductByShop,
	searchProductByUser,
	findAllProducts,
	findProduct,
	findByIdAndUpdate,
	getExistedProducts,
};
