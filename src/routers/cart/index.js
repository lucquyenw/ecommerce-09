'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.use(authentication);
router.get('/', asyncErrorHandler(cartController.getCart));
router.get(
	'/getlistusercart',
	asyncErrorHandler(cartController.getListUserCart)
);
router.post('/addToCart', asyncErrorHandler(cartController.addToCart));
router.put('/updateCart', asyncErrorHandler(cartController.updateCart));
router.delete(
	'/deleteProductInsideCart',
	asyncErrorHandler(cartController.deleteProductInCart)
);

module.exports = router;
