'use strict';

const Joi = require('joi');
const { BadRequestError } = require('../utils/customError');
const discountService = require('../services/discount.service');
const DiscountService = require('../services/discount.service');

class DiscountController {
	createDiscountCode = async (req, res, next) => {
		const schema = Joi.object({
			code: Joi.string().required(),
			start_date: Joi.date().greater(new Date()).required(),
			end_date: Joi.date()
				.greater(new Date())
				.greater(Joi.ref('start_date'))
				.required(),
			is_active: Joi.boolean(),
			min_order_value: Joi.number().required(),
			product_ids: Joi.array(),
			applies_to: Joi.string().valid('all', 'specific'),
			name: Joi.string().required(),
			description: Joi.string().required(),
			type: Joi.string().required(),
			value: Joi.number().required(),
			max_value: Joi.number().required(),
			max_uses: Joi.number().required(),
			uses_count: Joi.number().required(),
			max_uses_per_user: Joi.number().required(),
			user_used: Joi.array(),
		});

		const { error, value } = schema.validate(req.body);
		if (error) {
			throw new BadRequestError(error);
		}

		const result = await DiscountService.createDiscountCode({
			...req.body,
			shopId: req.user.userId,
		});

		return res.status(201).json({
			message: 'discount created successfully',
			metadata: result,
		});
	};

	getAllDiscountByShop = async (req, res, next) => {
		const { page, limit } = req.query;
		const result = await DiscountService.getAllDiscountCodesByShop({
			page,
			limit,
			shopId: req.user.userId,
		});

		return res.status(200).json({
			message: 'All discounts of shop',
			metadata: result,
		});
	};

	getAllProductsByCode = async (req, res, next) => {
		const result = await DiscountService.getProductsWithDiscountCode({
			...req.query,
		});

		return res.status(200).json({
			message: 'All product of code',
			metadata: result,
		});
	};

	getDiscountAmount = async (req, res, next) => {
		const result = await DiscountService.getDiscountAmount(req.body);

		return res.status(200).json({
			message: 'Discount amount',
			metadata: result,
		});
	};
}

module.exports = new DiscountController();
