'use strict';

const {
	product,
	clothing,
	electronic,
	funiture,
} = require('../models/product.model');
const { BadRequestError } = require('../utils/customError');

class ProductFactory {
	static productTypedClass = {};

	static registerProductTypedClass(key, className) {
		this.productTypedClass[key] = className;
	}

	/* 
        type: 'Clothing',
        payload
    */
	static async createProduct({ type, payload }) {
		if (!this.productTypedClass[type])
			throw BadRequestError('invalid product_type');

		return new this.productTypedClass[type](payload).createProduct();
	}
}

class Product {
	constructor({
		product_name,
		product_thumb,
		product_description,
		product_price,
		product_quantity,
		product_type,
		product_shop,
		product_attributes,
	}) {
		this.product_name = product_name;
		this.product_thumb = product_thumb;
		this.product_description = product_description;
		this.product_price = product_price;
		this.product_quantity = product_quantity;
		this.product_type = product_type;
		this.product_shop = product_shop;
		this.product_attributes = product_attributes;
	}

	async createProduct(product_id) {
		return await product.create({ ...this, _id: product_id });
	}
}

// define sub-class for different types of product
class Clothing extends Product {
	async createProduct() {
		const newClothing = await clothing.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newClothing) {
			throw new BadRequestError('create new Clothing failed');
		}

		const newProduct = await super.createProduct(newClothing._id);
		if (!newProduct) {
			throw new BadRequestError('create new Product failed');
		}

		return newProduct;
	}
}

class Electronic extends Product {
	async createProduct() {
		const newElectronic = await electronic.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newElectronic) {
			throw new BadRequestError('create new Electronic failed');
		}

		const newProduct = await super.createProduct(newElectronic._id);
		if (!newProduct) {
			throw new BadRequestError('create new Product failed');
		}

		return newProduct;
	}
}

class Furniture extends Product {
	async createProduct() {
		const newFurniture = await funiture.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});
		if (!newFurniture) {
			throw new BadRequestError('create new Electronic failed');
		}

		const newProduct = await super.createProduct(newFurniture._id);
		if (!newFurniture) {
			throw new BadRequestError('create new Product failed');
		}

		return newProduct;
	}
}

ProductFactory.registerProductTypedClass('Clothing', Clothing);
ProductFactory.registerProductTypedClass('Electronic', Electronic);
ProductFactory.registerProductTypedClass('Furniture', Furniture);

module.exports = {
	ProductFactory,
};
