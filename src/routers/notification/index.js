'use strict';

const express = require('express');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const NotificationController = require('../../controllers/noti.controller');
const router = express.Router();

router.use(authentication);
router.get('/', asyncErrorHandler(NotificationController.listNotiByUser));

module.exports = router;
