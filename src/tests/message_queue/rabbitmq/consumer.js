const amqp = require('amqplib');
const messages = 'Hello, RabbitMQ from quyen';

const runProducer = async () => {
	try {
		const connection = await amqp.connect('amqp://guest:12345@localhost');

		const channel = await connection.createChannel();

		const queueName = 'test-topic';
		await channel.assertQueue(queueName, {
			durable: true,
		});

		channel.consume(
			queueName,
			(messages) => {
				console.log(`Received message: ${messages.content.toString()}`);
			},
			{
				noAck: true,
			}
		);
	} catch (err) {
		console.error(err);
	}
};

runProducer().catch(console.err);
