const CartService = require('../services/cart.service');

class CartController {
	addToCart = async (req, res, next) => {
		return res.status(200).json({
			message: 'add to cart successfully',
			metadata: await CartService.addToCart(req.body),
		});
	};

	updateCart = async (req, res, next) => {
		return res.status(200).json({
			message: 'update cart successfully',
			metadata: await CartService.updateCart(req.body),
		});
	};

	deleteProductInCart = async (req, res, next) => {
		return res.status(200).json({
			message: 'delete cart successfully',
			metadata: await CartService.deleteProductInCart(req.body),
		});
	};

	getCart = async (req, res, next) => {
		return res.status(200).json({
			message: 'get cart successfully',
			metadata: await CartService.getUserCart(req.body),
		});
	};

	getListUserCart = async (req, res, next) => {
		return res.status(200).json({
			message: 'get list user cart successfully',
			metadata: await CartService.getListUserCart(req.query),
		});
	};
}

module.exports = new CartController();
