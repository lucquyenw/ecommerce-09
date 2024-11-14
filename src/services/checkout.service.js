'use strict';

const { findCartById } = require('../models/repositories/cart.repo');
const {
	checkProductsExist,
	getExistedProducts,
} = require('../models/repositories/product.repo');
const { BadRequestError } = require('../utils/customError');
const { getDiscountAmount } = require('./discount.service');
const { accquireLock, acquireLock, releaseLock } = require('./redis.service');

const order = require('../models/order.model');

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

	static orderByUser = async ({
		shop_order_ids,
		cartId,
		userId,
		user_address = {},
		user_payment = {},
	}) => {
		const { shop_order_ids_new, checkout_order } =
			await CheckOutService.checkoutOrder({
				cartId,
				userId,
				shop_order_ids,
			});

		const products = shop_order_ids_new.flatMap((order) => {
			return order.item_products;
		});

		const acquireProduct = [];
		for (let i = 0; i < products.length; i++) {
			const { productId, quantity } = products[i];
			const keyLock = await acquireLock(productId, quantity, cartId);
			acquireProduct.push(keyLock ? true : false);
			if (keyLock) {
				await releaseLock(keyLock);
			}
		}

		if (acquireProduct.includes(false)) {
			throw new BadRequestError(
				'One items quantity has been updated, please go back to your cart'
			);
		}

		const newOrder = await order.create({
			order_userId: userId,
			order_checkout: checkout_order,
			order_shipping: user_address,
			order_payment: user_payment,
			order_products: shop_order_ids_new,
		});

		if (newOrder) {
		}

		return newOrder;
	};

	static async getOrdersByUser() {}

	static async getOneOrderByUser() {}

	static async cancelOrder() {}

	static async updateOrderStatusByAdmin() {}
}

module.exports = CheckOutService;
