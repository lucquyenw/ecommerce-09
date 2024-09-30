'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const productController = require('../../controllers/product.controller');
const router = express.Router();

router.use(authentication);
router.post('/', asyncErrorHandler(productController.createProduct));

module.exports = router;
