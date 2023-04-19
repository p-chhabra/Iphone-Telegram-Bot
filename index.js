//imports
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fetchData = require("./fetchPrices");

const TGtoken = process.env.TGTOKEN;
const URL = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(TGtoken, { polling: true });

//BOT START COMMAND
bot.on("message", (message) => {
  console.log(message.text);
  let chatID = message.chat.id;
  let firstName = message.from.first_name;

  let startMsg = `Hello ${firstName}, this is a bot that will help you to get the latest iPhone prices in the current market \n\n 
  Here is the list of commands that you can use: \n\n
  /start :  displays an intro message\n
  /hello : displays a greeting message\n
  /prices :  shows the latest prices of iPhones\n
  /subscribe :  subscribe for daily updates on iphone prices\n`;

  if (message.text === "/start") {
    bot.sendMessage(chatID, startMsg);
  }
  console.log(chatID);
});

//BOT TEXT LISTENERS

//HELLO
bot.onText(/\/hello/, (message) => {
  let chatID = message.chat.id;
  let userName = message.from.username;
  let name = message.from.first_name + ` ` + message.from.last_name;

  let msg = `Hello ${name}, how can i help?`;

  bot.sendMessage(chatID, msg);
});

//PRICES
bot.onText(/\/prices/, async (message) => {
  let chatID = message.chat.id;
  let msg = "",
    data;

  bot.sendMessage(chatID, "Fetching data, please wait a few seconds.....");

  const opts = {
    reply_markup: {
      keyboard: [["FAQ"], ["Buy"]],
    },
    parse_mode: "Markdown",
  };

  data = await fetchData();
  await data.data.map((item) => {
    msg += `Model: ${item.name}\nPrice: ${item.prices[0].price} ${item.prices[0].currency}\n\n`;
  }, opts);

  console.log(msg);
  await bot.sendMessage(chatID, msg);
});

//SUBSCRIBE

//PORT
app.listen(PORT);

// mongoose
//   .connect(URL)
//   .then(() => {
//     console.log("Connected to DB");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
