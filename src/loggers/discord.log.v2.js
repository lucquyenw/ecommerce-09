'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_CHANNELID, DISCORD_TOKEN } = process.env;

class LoggerService {
	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			],
		});

		this.channelId = DISCORD_CHANNELID;
		this.token = DISCORD_TOKEN;

		this.client.on('ready', () => {
			console.log(`Logged in as ${this.client.user.tag}`);
		});

		this.client.login(DISCORD_TOKEN);
	}

	sendToFormatCode(logData) {
		const {
			code,
			message = `this is some additional information about the code.`,
			title = 'code example',
		} = logData;
		const codeMessage = {
			content: message,
			embeds: [
				{
					color: parseInt('00ff00', 16),
					title,
					description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
				},
			],
		};

		this.sendToMessage(codeMessage);
	}

	sendToMessage(message = 'message') {
		const channel = this.client.channels.cache.get(this.channelId);
		if (!channel) {
			console.error(`couldn't find the channel...`, this.channelId);
			return;
		}

		channel.send(message).catch((e) => console.error(e));
	}
}

const loggerService = new LoggerService();

module.exports = loggerService;
