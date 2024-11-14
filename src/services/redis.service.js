'use strict';

const redis = require('redis');
const { promisify } = require('util');
const { reserveInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient({
	port: 6379,
	host: '127.0.0.1',
});

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
redisClient.connect();

redisClient.on('error', (err) => {
	console.log('Error occured while connecting or accessing redis server');
});

const acquireLock = async (productId, quantity, cartId) => {
	const key = `lock_v2024_${productId}`;
	const retryTimes = 10;
	const expireTime = 3000;

	for (let i = 0; i < retryTimes; i++) {
		const result = await redisClient.setNX(key, '1');
		console.log('result::', result);
		if (result) {
			// process with inventory
			const reservation = await reserveInventory({
				productId,
				quantity,
				cartId,
			});

			if (reservation.modifiedCount) {
				await redisClient.pExpire(key, expireTime);
				return key;
			}

			return null;
		} else {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}
};

const releaseLock = async (keyLock) => {
	return await redisClient.DEL(keyLock);
};

module.exports = {
	acquireLock,
	releaseLock,
};
