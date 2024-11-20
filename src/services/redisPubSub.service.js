const Redis = require('redis');

class RedisPubSubService {
	constructor() {
		this.subscriber = Redis.createClient({
			port: 6379,
			host: '127.0.0.1',
		});
		this.publisher = Redis.createClient({
			port: 6379,
			host: '127.0.0.1',
		});
	}

	async publish(channel, message) {
		await this.publisher.connect();

		try {
			await this.publisher.publish(channel, message);
		} catch (error) {
			console.log(error);
		}
	}

	async subscibe(channel, callback) {
		await this.subscriber.connect();
		await this.subscriber.subscribe(channel, (message) => {
			callback(channel, message);
		});
	}
}

module.exports = new RedisPubSubService();
