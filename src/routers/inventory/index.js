'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();

router.use(authentication);
router.post('/', asyncErrorHandler(inventoryController.addStockToInventory));

module.exports = router;
