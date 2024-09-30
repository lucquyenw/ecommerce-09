'use strict';

const { ProductFactory } = require('../services/product.service');

class ProductController {
	createProduct = async (req, res, next) => {
		const { type, ...payload } = req.body;

		const result = await ProductFactory.createProduct({
			type: payload.product_type,
			payload: { ...payload, product_shop: req.user.userId },
		});
		return res.status(200).json(result);
	};
}

module.exports = new ProductController();
