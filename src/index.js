require("dotenv").config();
const iex = require("./iex")
const parse = require("./parse")
const currencyConverter = require("./currencyconverter")
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

bot.on('message', (ctx) => {
  console.log(ctx.message);

  if (ctx.message !== null) {
    if (startsWithSymbolSign(ctx.message.text)) {
      const symbol = ctx.message.text.substring(1);
      iex.latest(ctx, symbol);
    } else if (startsWithCommandSign(ctx.message.text)) {
      const parameters = ctx.message.text.split(" ");

      if (parameters.length === 1) {
        ctx.reply(`Missing parameter.`)
      } else {
        handleCommands(ctx, parameters);
      }
    }
    
    if(containsToTheMoonText(ctx.message.text)){
      ctx.replyWithMarkdown(`\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`);
    }
  }
});


bot.launch();
  
function containsToTheMoonText(text) {
  return text != null && text.includes("to the moon");
}

function startsWithSymbolSign(text) {
  return text != null && text.startsWith("$");
}

function startsWithCommandSign(text) {
  return text != null && text.startsWith("/");
}

function handleCommands(ctx, parameters) {
  const command = parameters[0].substring(1);
  const symbol = parameters[1];

  if (command) {
    switch (command) {
      case "crypto":
        iex.cryptos(ctx, symbol);
        break;
      case "dividends":
        iex.dividends(ctx, symbol);
        break;
      case "info":
        iex.info(ctx, symbol);
        break;
      case "stock":
        iex.latest(ctx, symbol);
        break;
      // paid feature, doesnt work
      case "convert":
        const amount = parameters[1];
        const currencyFrom = parameters[2];
        const currencyTo = parameters[3];
        
        currencyConverter.convertCurrency(amount, currencyFrom, currencyTo, function(err, amount) {
          if(err){
            ctx.reply(`Could not convert currencies.`);
            console.log(err);
          } else {
            ctx.replyWithMarkdown(`${amount} ${currencyFrom.toUpperCase()} to ${currencyTo.toUpperCase()} is *${amount} ${currencyTo.toUpperCase()}*`);
          }
        });
        break;
      case "isin":
        iex.isin(ctx, symbol);
        break;
      case "portfolio":
        parse.portfolio(ctx, parameters);
        break;
      default:
        break;
    }
  }
}
