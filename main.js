const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const model = {
  normal: "gpt-3.5-turbo",
  plus: "gpt-4",
};

console.log("TELEGRAM_BOT_TOKEN", process.env.TELEGRAM_BOT_TOKEN);
console.log("CHATGPT_TOKEN", process.env.CHATGPT_TOKEN);

const configuration = new Configuration({
  apiKey: process.env.CHATGPT_TOKEN,
});
const openai = new OpenAIApi(configuration);

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// bot.getMe().then((res) => {
//   console.log(res);
// });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const ping = await bot.sendMessage(chatId, "typing...");
  try {
    const chat_completion = await openai.createChatCompletion({
      model: model.normal,
      messages: [{ role: "user", content: msg.text.trim() }],
    });

    console.log(msg.text.trim(), JSON.stringify(chat_completion.data));

    await bot.editMessageText(chat_completion.data.choices[0].message.content, {
      chat_id: chatId,
      message_id: ping.message_id,
      parse_mode: "Markdown",
    });
  } catch (error) {
    await bot.editMessageText(`Got some error: ${JSON.stringify(error)}`, {
      chat_id: chatId,
      message_id: ping.message_id,
    });
  }
});
