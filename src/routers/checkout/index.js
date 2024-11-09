'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const checkOutController = require('../../controllers/checkout.controller');
const router = express.Router();

router.use(authentication);
router.get('/', asyncErrorHandler(checkOutController.checkoutReview));

module.exports = router;
