'use strict';

const CheckOutService = require('../services/checkout.service');

class checkOutController {
	checkoutReview = async (req, res, next) => {
		return res.status(200).json({
			message: 'Check out review',
			metadata: await CheckOutService.checkoutOrder(req.body),
		});
	};

	orderByUser = async (req, res, next) => {
		return res.status(200).json({
			message: 'Check out review',
			metadata: await CheckOutService.orderByUser(req.body),
		});
	};
}

module.exports = new checkOutController();
