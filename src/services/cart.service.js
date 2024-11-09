const {
	findCart,
	createOrUpdateCart,
	updateOne,
} = require('../models/repositories/cart.repo');
const { findProduct } = require('../models/repositories/product.repo');
const { convertToObjectId } = require('../utils');
const { NotFoundError } = require('../utils/customError');

class CartService {
	static async createUserCart({ userId, product }) {
		const foundProduct = await findProduct({ product_id: product.productId });
		if (!foundProduct) {
			throw new NotFoundError('product not found');
		}

		const query = { cart_userId: +userId, cart_state: 'active' };
		const updateOrInsert = {
			$addToSet: {
				cart_products: {
					...product,
					name: foundProduct.product_name,
					price: foundProduct.product_price * product.quantity,
				},
			},
		};

		const options = { upsert: true, new: true };

		return await createOrUpdateCart({
			query,
			update: updateOrInsert,
			option: options,
		});
	}

	static async updateUserCartQuantity({ userId, product }) {
		const { productId, quantity } = product;

		const foundProduct = await findProduct({ product_id: productId });
		if (!foundProduct) {
			throw new NotFoundError('product not found');
		}

		const query = {
			cart_userId: +userId,
			'cart_products.productId': productId,
		};
		const updateSet = {
			$inc: {
				'cart_products.$.quantity': quantity,
				'cart_products.$.price': quantity * foundProduct.product_price,
			},
		};

		return await createOrUpdateCart({
			query,
			update: updateSet,
			option: { upsert: true, new: true },
		});
	}

	static async addToCart({ userId, product = {} }) {
		const existedCart = await findCart({ filter: { cart_userId: +userId } });

		const inexistedProduct = existedCart.cart_products.every((exist) => {
			return exist.productId !== product.productId;
		});

		if (
			existedCart.cart_products.length === 0 ||
			inexistedProduct ||
			!existedCart
		) {
			return await CartService.createUserCart({ userId, product });
		}

		return await CartService.updateUserCartQuantity({ userId, product });
	}

	/*
    shop_order_ids: [
    {
        shopId,
        item_products: [
            {
                quantity, 
                productId,
                shopId,
                old_quantity,
                price
            }
                
        ],
        version
    }]
    */
	static async updateCart({ userId, shop_order_ids }) {
		const { productId, quantity, old_quantity } =
			shop_order_ids[0]?.item_products[0];

		const foundProduct = await findProduct({ product_id: productId });
		if (!foundProduct) {
			throw new NotFoundError('product not found');
		}

		if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
			throw new NotFoundError('product does not belongs to the shop');
		}

		if (quantity === 0) {
			return await CartService.deleteProductInCart({ userId, productId });
		}

		return await CartService.updateUserCartQuantity({
			userId,
			product: {
				productId,
				quantity: quantity - old_quantity,
			},
		});
	}

	static async deleteProductInCart({ userId, productId }) {
		const query = { cart_userId: +userId, cart_state: 'active' };
		const updateSet = {
			$pull: {
				cart_products: {
					productId,
				},
			},
		};

		const deleteCart = await updateOne({ query, update: updateSet });
		return deleteCart;
	}

	static async getListUserCart({ userId }) {
		const filter = { cart_userId: +userId };
		return await findCart({ filter });
	}
}

module.exports = CartService;
