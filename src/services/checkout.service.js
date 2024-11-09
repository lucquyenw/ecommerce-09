'use strict';

const { findCartById } = require('../models/repositories/cart.repo');
const {
	checkProductsExist,
	getExistedProducts,
} = require('../models/repositories/product.repo');
const { BadRequestError } = require('../utils/customError');
const { getDiscountAmount } = require('./discount.service');

class CheckOutService {
	/**
	 * {
	 *  cartId,
	 *  userId,
	 * shop_order_ids: [
	 *  shopId,
	 * shop_discounts: [],
	 * item_products: [{
	 *  price,
	 *  quantity,
	 * productId
	 * }]
	 * ]
	 * }
	 */
	static checkoutOrder = async ({ cartId, userId, shop_order_ids = [] }) => {
		const foundCart = await findCartById({ id: cartId });

		if (!foundCart) {
			throw new BadRequestError('cart doesnt exist!');
		}

		const checkout_order = {
				totalPrice: 0,
				freeShip: 0,
				totalDiscount: 0,
				totalCheckout: 0,
			},
			shop_order_ids_new = [];

		for (let i = 0; i < shop_order_ids.length; i++) {
			const {
				item_products = [],
				shopId,
				shop_discounts = [],
			} = shop_order_ids[i];

			const products = await getExistedProducts({ products: item_products });

			if (products.some((product) => !product)) {
				throw new BadRequestError('order wrong!!!');
			}

			const checkoutPrice = products.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			checkout_order.totalPrice += checkoutPrice;

			const itemCheckout = {
				shopId,
				shop_discounts,
				priceRaw: checkoutPrice,
				priceApplyDiscount: checkoutPrice,
				item_products: products,
			};

			if (shop_discounts.length > 0) {
				let totalDiscountAmount = 0;
				for (let i = 0; i < shop_discounts.length; i++) {
					const discountCode = shop_discounts[i];
					const discountAmount = await getDiscountAmount({
						codeId: discountCode,
						userId,
						products: products.map((product) => ({
							id: product.productId,
							...product,
						})),
						shopId,
					});

					totalDiscountAmount += discountAmount.discount;
				}

				checkout_order.totalDiscount += totalDiscountAmount;

				if (totalDiscountAmount > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - totalDiscountAmount;
				}
			}

			checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
			shop_order_ids_new.push(itemCheckout);
		}

		return {
			shop_order_ids,
			shop_order_ids_new,
			checkout_order,
		};
	};
}

module.exports = CheckOutService;
