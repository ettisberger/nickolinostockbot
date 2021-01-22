require("dotenv").config();
const { Telegraf } = require("telegraf");
const BotToken = process.env.BOT_TOKEN;

console.log(process.env.BOT_TOKEN)
const bot = new Telegraf(BotToken);
const axios = require("axios");
const params = {
  access_key: process.env.MARKETSTACK_API_KEY
}

bot.start(ctx => {
  console.log(ctx.message.from)

  if (ctx.message.from.username !== undefined) {
    ctx.reply(`Hello. Im nickolino.`);
  }
});

bot.on('sticker', (ctx) => ctx.reply("Nice sticker bro."));

bot.on('message', (ctx) => {
  console.log(ctx.message);
  if (ctx.message !== null && ctx.message.text != null && ctx.message.text.startsWith("$")) {
    const commands = ctx.message.text.split(" ");
    const symbol =commands[0].substring(1);

    if (commands.length > 1) {
      handleCommands(commands, ctx, symbol);
    } else {
      printLatest(ctx, symbol);
    }
  }
});

bot.launch();

function handleCommands(commands, ctx, symbol) {
  const command = commands[1];

  console.log(command)

  if (command) {
    switch (command) {
      case "eod":
        printEod(ctx, symbol);
        break;
      case "info":
        printSymbolInfo(ctx, symbol);
        break;
      case "now":
        printLatest(ctx, symbol);
        break;
      default:
        break;
    }
  }
}

function printSymbolInfo(ctx, symbol) {
  axios.get(process.env.MARKETSTACK_API_URL + "tickers/" + symbol, { params })
  .then(response => {
    console.log(response.data)

    const data = response.data;
    ctx.reply(`$${data.symbol}\nname => ${data.name}
    \nstock exchange => ${data["stock_exchange"].name}
    \nwebsite => ${data["stock_exchange"].website}
    \ncity => ${data["stock_exchange"].city}
    `);
  }).catch(error => {
    console.log(error.response.data);
    ctx.reply(`Damn something went wrong >__>\n${error.response.data.error.message}`);
  })
}

function printLatest(ctx, symbol) {
  axios.get(process.env.MARKETSTACK_API_URL + "tickers/" + symbol + "/intraday/latest", { params })
  .then(response => {
    console.log(response.data)

    const data = response.data;
    ctx.reply(`$${data['symbol']} last available stock price is $${data['last']} on ${data['date']}`);
  }).catch(error => {
    console.log(error.response.data);
    ctx.reply(`Damn something went wrong >__>\n${error.response.data.error.message}`);
  })
}

function printEod(ctx, symbol) {
  axios.get(process.env.MARKETSTACK_API_URL + "tickers/" + symbol + "/eod/latest", { params })
  .then(response => {
    console.log(response.data)

    const data = response.data;
    ctx.reply(`$${data['symbol']} has a day high of $${data['high']} on ${data['date']}`);
  }).catch(error => {
    console.log(error.response.data);
    ctx.reply(`Damn something went wrong >__>\n${error.response.data.error.message}`);
  })
}
