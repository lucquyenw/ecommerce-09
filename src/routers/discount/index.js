'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

router.use(authentication);
router.post('/', asyncErrorHandler(discountController.createDiscountCode));
router.get(
	'/getAllDiscountCodeByShop',
	asyncErrorHandler(discountController.getAllDiscountByShop)
);

router.get(
	'/getProductsByCode',
	asyncErrorHandler(discountController.getAllProductsByCode)
);

module.exports = router;
