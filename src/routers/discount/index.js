'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

router.get(
	'/list_product_code',
	asyncErrorHandler(discountController.getAllProductsByCode)
);

router.post('/amount', asyncErrorHandler(discountController.getDiscountAmount));

router.use(authentication);
router.post('/', asyncErrorHandler(discountController.createDiscountCode));
router.get(
	'/getAllDiscountCodeByShop',
	asyncErrorHandler(discountController.getAllDiscountByShop)
);

module.exports = router;
