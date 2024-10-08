'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.get(
	'/search/:keySearch',
	asyncErrorHandler(productController.getListSearchProduct)
);

router.get('/', asyncErrorHandler(productController.findAllProducts));
router.get('/:id', asyncErrorHandler(productController.findProduct));

router.use(authentication);
router.post('/', asyncErrorHandler(productController.createProduct));
router.get(
	'/draft/all',
	asyncErrorHandler(productController.getAllDraftsForShop)
);

router.get(
	'/published/all',
	asyncErrorHandler(productController.getAllPublishedProductsForShop)
);

router.put(
	'/publish/:id',
	asyncErrorHandler(productController.publishProductByShop)
);

router.put(
	'/unpublish/:id',
	asyncErrorHandler(productController.unpublishProductByShop)
);

router.patch('/:id', asyncErrorHandler(productController.updateProduct));

module.exports = router;
