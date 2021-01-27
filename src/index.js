require("dotenv").config();
const iex = require("./iex")
const parse = require("./parse")
const currencyConverter = require("./currencyconverter")
const messages = require("./messages")
const { Telegraf } = require("telegraf");
const botToken = process.env.BOT_TOKEN;
const bot = new Telegraf(botToken);

bot.start(ctx => {
  console.log(ctx.message.from)

  if (ctx.message.from.username !== undefined) {
    ctx.reply(`Hello. Im nickolino.`);
  }
});

bot.on('sticker', (ctx) => ctx.reply("Nice sticker."));

bot.command('crypto', ctx => {
  const symbol = getParameters(ctx.message.text)[1];
  iex.cryptos(ctx, symbol);
});

bot.command('dividends', ctx => {
  const symbol = getParameters(ctx.message.text)[1];
  iex.dividends(ctx, symbol);
});

bot.command('info', ctx => {
  const symbol = getParameters(ctx.message.text)[1];
  iex.info(ctx, symbol);
});

bot.command('stock', ctx => {
  const symbol = getParameters(ctx.message.text)[1];
  iex.latest(ctx, symbol);
});

bot.command('isin', ctx => {
  const symbol = getParameters(ctx.message.text)[1];
  iex.isin(ctx, symbol);
});

bot.command('portfolio', ctx => {
  const parameters = getParameters(ctx.message.text);
  parse.portfolio(ctx, parameters);
});

bot.command('convert', ctx => {
  const parameters = getParameters(ctx.message.text);
  const amount = parameters[1];
  const currencyFrom = parameters[2];
  const currencyTo = parameters[3];

  currencyConverter.convert(ctx, amount, currencyFrom, currencyTo);
});

bot.on('text', (ctx) => {
  console.log(ctx.message);

  if (ctx.message !== null) {
    if (startsWithSymbolSign(ctx.message.text)) {
      const symbol = ctx.message.text.substring(1);
      iex.latest(ctx, symbol);
    }

    messages.onText(ctx, ctx.message.text);
  }
});


bot.launch();

function startsWithSymbolSign(text) {
  return text != null && text.startsWith("$");
}

function getParameters(text){
  return text.split(" ");
}
