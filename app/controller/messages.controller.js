process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config({ path: "../../.env" });

const telegramClient = new TelegramBot(process.env.TGTOKEN, { polling: true });

// Send message to the telegram bot.
exports.messageSend = async (req, res) => {
	telegramClient.sendMessage('474782403', 
`📨 New message from #eaterybot : 
👋 Name: ${req.params.name || "No name provided"}
📬 Emаil: ${req.params.email || "No email provided"}
💬 Message: ${req.params.message || "No message provided"}`)
		.then(() => {
			return res.status(200).send({ type: "OK", message: "Sent." })
		})
		.catch(() => {
			return res.status(200).send({ type: "Error", message: "Error while sending." })
		});
};