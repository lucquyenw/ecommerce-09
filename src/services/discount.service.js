const discountModel = require('../models/discount.model');
const {
	findExistDiscount,
	createDiscount,
	findAllDiscounts,
	findAllDiscountsWithUnSelect,
} = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectId } = require('../utils');
const { BadRequestError, NotFoundError } = require('../utils/customError');

class DiscountService {
	static async createDiscountCode(body) {
		const {
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
		} = body;

		const foundDiscount = await findExistDiscount({
			discountCode: code,
			shopId: convertToObjectId(shopId),
		});

		if (foundDiscount && foundDiscount.discount_is_active) {
			throw new BadRequestError('Discount exists!');
		}

		const newDiscount = await createDiscount({
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
		});

		return newDiscount;
	}

	static async updateDiscountCode() {}

	static async getProductsWithDiscountCode({
		code,
		shopId,
		userId,
		limit,
		page,
	}) {
		const foundDiscount = await findExistDiscount({
			discountCode: code,
			shopId: convertToObjectId(shopId),
		});

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new NotFoundError('Discount not exists!');
		}

		const { discount_applies_to, discount_product_ids, discount_shop_id } =
			foundDiscount;
		let products;
		if (discount_applies_to === 'all') {
			products = await findAllProducts({
				filter: {
					product_shop: convertToObjectId(shopId),
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			});
		}

		if (discount_applies_to === 'specific') {
			products = await findAllProducts({
				filter: {
					_id: { $in: discount_product_ids },
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: 'ctime',
				select: ['product_name'],
			});
		}

		return products;
	}

	static async getAllDiscountCodesByShop({ limit, page, shopId }) {
		const discounts = await findAllDiscountsWithUnSelect({
			limit: +limit,
			page: +page,
			filter: {
				discount_shop_id: convertToObjectId(shopId),
				discount_is_active: true,
			},
			unSelect: ['__v', 'discount_shopId'],
		});

		return discounts;
	}
}

module.exports = DiscountService;
