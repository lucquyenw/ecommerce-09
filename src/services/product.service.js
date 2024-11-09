'use strict';

const {
	product,
	clothing,
	electronic,
	furniture,
} = require('../models/product.model');
const { createInventory } = require('../models/repositories/inventory.repo');
const {
	findAllDraftForShop,
	findAllPublishedForShop,
	unpublishProductByShop,
	searchProductByUser,
	publishProductByShop,
	findAllProducts,
	findProduct,
	findByIdAndUpdate,
} = require('../models/repositories/product.repo');
const { removeNullFromPayload, updateNestedObjectParser } = require('../utils');
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

	static async updateProduct({ type, payload, productId }) {
		if (!this.productTypedClass[type])
			throw BadRequestError('invalid product_type');

		return new this.productTypedClass[type](payload).updateProduct(productId);
	}

	static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isDraft: true };
		return await findAllDraftForShop({ query, limit, skip });
	}

	static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
		const query = { product_shop, isPublished: true };
		return await findAllPublishedForShop({ query, limit, skip });
	}

	static async publishProductByShop({ product_shop, product_id }) {
		return await publishProductByShop({ product_shop, product_id });
	}

	static async unpublishProductByShop({ product_shop, product_id }) {
		return await unpublishProductByShop({ product_shop, product_id });
	}

	static async searchProducts({ keySearch }) {
		return await searchProductByUser({ keySearch });
	}

	static async findAllProducts({
		limit = 50,
		sort = 'ctime',
		page = 1,
		filter = { isPublished: true },
	}) {
		return await findAllProducts({
			limit,
			sort,
			page,
			filter,
			select: [
				'product_name',
				'product_price',
				'product_thumb',
				'product_shop',
			],
		});
	}

	static async findProduct(product_id) {
		return await findProduct({ product_id, unSelect: ['__v'] });
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
		const createdProduct = await product.create({ ...this, _id: product_id });

		if (createdProduct) {
			await createInventory({
				productId: createdProduct._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			});
		}

		return createdProduct;
	}

	async updateProduct(product_id, bodyUpdate) {
		return await findByIdAndUpdate({
			productId: product_id,
			bodyUpdate,
			model: product,
		});
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

	async updateProduct(productId) {
		const objectParams = this;
		if (objectParams.product_attributes) {
			await findByIdAndUpdate({
				productId,
				bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
				model: clothing,
			});
		}

		const updateProduct = await super.updateProduct(
			productId,
			updateNestedObjectParser(objectParams)
		);
		return updateProduct;
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

	async updateProduct(productId) {
		const objectParams = this;
		if (objectParams.product_attributes) {
			await findByIdAndUpdate({
				productId,
				bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
				model: electronic,
			});
		}

		const updateProduct = await super.updateProduct(
			productId,
			updateNestedObjectParser(objectParams)
		);
		return updateProduct;
	}
}

class Furniture extends Product {
	async createProduct() {
		const newFurniture = await furniture.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		});

		console.log('created furniture', newFurniture);
		if (!newFurniture) {
			throw new BadRequestError('create new funiture failed');
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
