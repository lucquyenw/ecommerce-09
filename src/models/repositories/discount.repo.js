'use strict';

const { convertToObjectId, getUnSelectData } = require('../../utils');
const discountModel = require('../discount.model');

const findExistDiscount = async ({ discountCode, shopId }) => {
	return await discountModel
		.findOne({ discount_code: discountCode, discount_shop_id: shopId })
		.lean();
};

const findAllDiscounts = async ({
	filter,
	select,
	limit = 50,
	page = 1,
	sort = 'ctime',
}) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const discounts = await discountModel
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();

	return discounts;
};

const findAllDiscountsWithUnSelect = async ({
	filter,
	unSelect,
	limit = 50,
	page = 1,
	sort = 'ctime',
}) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const discounts = await discountModel
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getUnSelectData(unSelect))
		.lean();

	return discounts;
};

const createDiscount = async ({
	code,
	start_date,
	end_date,
	is_active,
	shopId,
	min_order_value,
	product_ids,
	applies_to,
	name,
	description,
	type,
	value,
	max_value,
	max_uses,
	uses_count,
	max_uses_per_user,
	user_used,
}) => {
	return await discountModel.create({
		discount_name: name,
		discount_description: description,
		discount_type: type,
		discount_value: value,
		discount_max_value: max_value,
		discount_code: code,
		discount_start_date: new Date(start_date),
		discount_end_date: new Date(end_date),
		discount_max_uses: max_uses,
		discount_uses_count: uses_count,
		discount_user_used: user_used,
		discount_max_uses_per_user: max_uses_per_user,
		discount_min_order_value: min_order_value || 0,
		discount_shop_id: convertToObjectId(shopId),
		discount_is_active: is_active,
		discount_applies_to: applies_to,
		discount_product_ids: applies_to === 'all' ? [] : product_ids,
	});
};

const findOneDiscount = async ({ filter, unSelect }) => {
	return await discountModel.findOne(filter, getUnSelectData(unSelect)).lean();
};

const deleteOneDiscount = async ({ filter }) => {
	return await discountModel.findOneAndDelete(filter);
};

const updateOneDiscount = async ({ id, update, options }) => {
	return await discountModel.findByIdAndDelete(id, update, options);
};

module.exports = {
	findExistDiscount,
	createDiscount,
	findAllDiscounts,
	findAllDiscountsWithUnSelect,
	findOneDiscount,
	deleteOneDiscount,
	updateOneDiscount,
};
