//imports
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fetchData = require("./fetchPrices");
const User = require("./modals/User");

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
  /subscribe :  subscribe for daily updates on iphone prices\n
  /unsubscribe :  unsubscribe from daily updates\n`;

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
  let name =
    message.from.first_name +
    (message.from.last_name ? ` ${message.from.last_name}` : "");

  let msg = `Hello ${name}, how can i help?`;

  bot.sendMessage(chatID, msg);
});

//PRICES
bot.onText(/\/prices/, async (message) => {
  let chatID = message.chat.id;
  let msg = "",
    data;

  bot.sendMessage(chatID, "Fetching data, please wait a few seconds.....");

  data = await fetchData();
  await data.data.data.map((item) => {
    msg += `Model: ${item.name}\nPrice: ${item.prices[0].price} ${item.prices[0].currency}\n\n`;
  });

  await bot.sendMessage(chatID, msg);
});

//SUBSCRIBE
bot.onText(/\/subscribe/, async (message) => {
  let chatID = message.chat.id;
  let username = message.from.username;
  let firstname = message.from.first_name;
  let lastname = message.from.last_name;

  try {
    const response = await User.find({ userName: username });
    if (response.length == 0) {
      const user = new User({
        firstName: firstname,
        lastName: lastname,
        userName: username,
        ID: chatID,
      });
      await user.save();
      await bot.sendMessage(
        chatID,
        "You have been subscribed to daily updates"
      );
    } else {
      await bot.sendMessage(
        chatID,
        "You are already subscribed to daily updates"
      );
    }
  } catch (err) {
    console.log(err);
  }
});

//UNSUBSCRIBE
bot.onText(/\/unsubscribe/, async (message) => {
  let chatID = message.chat.id;
  let username = message.from.username;

  try {
    let response = await User.deleteOne({ userName: username });
    console.log(response);
    if (response.deletedCount == 0)
      await bot.sendMessage(chatID, "You are not subscribed");
    else await bot.sendMessage(chatID, "You have been unsubscribed");
  } catch (err) {
    console.log(err);
  }
});

//SENDING DAILY UPDATES
const sendUpdates = async () => {
  let data = await fetchData();

  let users = await User.find({});
  console.log(users);

  users.map(async (item) => {
    await data.data.data.map((item) => {
      msg += `Model: ${item.name}\nPrice: ${item.prices[0].price} ${item.prices[0].currency}\n\n`;
    });

    await bot.sendMessage(item.ID, msg);
  });
};
setInterval(sendUpdates, 86400000);

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
