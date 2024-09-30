'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { authentication } = require('../../utils/authUtil');
const router = express.Router();

//sign up
router.post('/shop/signup', asyncErrorHandler(accessController.signUp));
router.post('/shop/login', asyncErrorHandler(accessController.logIn));
router.post(
	'/shop/refresh-token',
	asyncErrorHandler(accessController.refreshToken)
);

router.use(authentication);
router.post('/shop/logout', asyncErrorHandler(accessController.logOut));

module.exports = router;
