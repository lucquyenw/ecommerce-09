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

	updateProduct = async (req, res, next) => {
		return res.status(200).json({
			message: 'update product successfully',
			metadata: await ProductFactory.updateProduct({
				type: req.body.product_type,
				payload: { ...req.body, product_shop: req.user.userId },
				productId: req.params.id,
			}),
		});
	};

	//QUERY//
	/**
	 * Get all Drafts for shop
	 * @param {Number} limit
	 * @param {Number} skip
	 * @return { JSON}
	 */
	getAllDraftsForShop = async (req, res, next) => {
		return res.status(200).json({
			message: 'get all draft product successfully',
			metadata: await ProductFactory.findAllDraftForShop({
				product_shop: req.user.userId,
			}),
		});
	};

	getAllPublishedProductsForShop = async (req, res, next) => {
		return res.status(200).json({
			message: 'get all published products successfully',
			metadata: await ProductFactory.findAllPublishedForShop({
				product_shop: req.user.userId,
			}),
		});
	};

	getListSearchProduct = async (req, res, next) => {
		return res.status(200).json({
			message: `search published products with ${req.params.keySearch} successfully`,
			metadata: await ProductFactory.searchProducts({
				keySearch: req.params.keySearch,
			}),
		});
	};

	findAllProducts = async (req, res, next) => {
		return res.status(200).json({
			message: `find all products successfully`,
			metadata: await ProductFactory.findAllProducts(req.query),
		});
	};

	findProduct = async (req, res, next) => {
		return res.status(200).json({
			message: `find all products successfully`,
			metadata: await ProductFactory.findProduct(req.params.id),
		});
	};
	//END QUERY//

	publishProductByShop = async (req, res, next) => {
		return res.status(200).json({
			message: `published product ${req.params.id}`,
			metadata: await ProductFactory.publishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			}),
		});
	};

	unpublishProductByShop = async (req, res, next) => {
		return res.status(200).json({
			message: `unpublished product ${req.params.id}`,
			metadata: await ProductFactory.unpublishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			}),
		});
	};
}

module.exports = new ProductController();
