'use strict';

const express = require('express');
const { apiKey, checkPermisison } = require('../middlewares/checkAuth');
const asyncErrorhandler = require('../utils/asyncErrorHandler');
const router = express.Router();

//check client is authorized and check do the client app has permisison to call API
router.use(
	asyncErrorhandler(apiKey),
	asyncErrorhandler(checkPermisison('0000'))
);
router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));

module.exports = router;
