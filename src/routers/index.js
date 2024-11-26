'use strict';

const express = require('express');
const { apiKey, checkPermisison } = require('../middlewares/checkAuth');
const asyncErrorhandler = require('../utils/asyncErrorHandler');
const { pushToLogDiscord } = require('../middlewares');
const router = express.Router();

//check client is authorized and check do the client app has permisison to call API
router.use(pushToLogDiscord);
router.use(
	asyncErrorhandler(apiKey),
	asyncErrorhandler(checkPermisison('0000'))
);
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api/noti', require('./notification'));
router.use('/v1/api', require('./access'));

module.exports = router;
