'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const router = express.Router();

//sign up
router.post('/shop/signup', asyncErrorHandler(accessController.signUp));

module.exports = router;
