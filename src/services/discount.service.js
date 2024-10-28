const discountModel = require('../models/discount.model');
const {
	findExistDiscount,
	createDiscount,
	findAllDiscounts,
	findAllDiscountsWithUnSelect,
	findOneDiscount,
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

	static async getDiscountAmount({ codeId, userId, shopId, products }) {
		const foundDiscount = await findOneDiscount({
			filter: {
				discount_code: codeId,
				discount_shop_id: convertToObjectId(shopId),
				discount_product_ids: { $in: products.map((product) => product.id) },
			},
		});

		if (!foundDiscount) {
			throw new NotFoundError('discount not found');
		}

		const {
			discount_is_active,
			discount_max_uses,
			discount_start_date,
			discount_end_date,
			discount_type,
			discount_max_uses_per_user,
			discount_min_order_value,
			discount_user_used,
			discount_value,
			discount_product_ids,
		} = foundDiscount;

		if (!discount_is_active) {
			throw new NotFoundError('discount inactive');
		}

		if (!discount_max_uses) {
			throw new NotFoundError('discount are out');
		}

		// if (
		// 	new Date() < new Date(discount_start_date) ||
		// 	new Date() > new Date(discount_end_date)
		// ) {
		// 	throw new NotFoundError('discount has expired!');
		// }

		let totalOrder = 0;
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			if (totalOrder < discount_min_order_value) {
				throw new NotFoundError(
					`discount requires a minimum order value of ${discount_min_order_value}`
				);
			}
		}

		if (discount_max_uses_per_user > 0) {
			const usedUserDiscount = discount_user_used.find(
				(user) => user.userId === userId
			);

			if (usedUserDiscount) {
			}
		}

		const amount =
			discount_type === 'fixed_amount'
				? discount_value
				: totalOrder * (discount_value / 100);

		return {
			totalOrder,
			discount: amount,
			totalPrice: totalOrder - amount,
		};
	}

	static async deleteDiscountModel({ shopId, codeId }) {
		const deleted = await deleteOneDiscount({
			filter: {
				discount_code: codeId,
				discount_shopId: convertToObjectId(shopId),
			},
		});

		return deleted;
	}

	static async cancelDiscountCode({ codeId, shopId, userId }) {
		const foundDiscount = await findOneDiscount({
			filter: {
				discount_code: codeId,
				discount_shop_id: convertToObjectId(shopId),
			},
		});

		if (!foundDiscount) {
			throw new NotFoundError('discount does not exist');
		}

		const result = await updateOneDiscount({
			id: foundDiscount._id,
			update: {
				$pull: {
					discount_user_used: userId,
				},
				$inc: {
					discount_max_uses: 1,
					discount_uses_count: -1,
				},
			},
		});

		return result;
	}
}

module.exports = DiscountService;
