const InventoryServiceTest = require('./inventory.test');
const ProductServiceTest = require('./product.test');

const product = new ProductServiceTest();
const inventory = new InventoryServiceTest();

product.purchaseProduct('1', 10);
