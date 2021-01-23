require("dotenv").config();
const iex = require("./functions")
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
  if (ctx.message !== null && ctx.message.text != null && ctx.message.text.startsWith("$")) {
    const commands = ctx.message.text.split(" ");
    const symbol = commands[0].substring(1);

    if (commands.length > 1) {
      handleCommands(commands, ctx, symbol);
    } else {
      iex.latest(ctx, symbol);
    }
  }
});

bot.launch();

function handleCommands(commands, ctx, symbol) {
  const command = commands[1];

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
      default:
        break;
    }
  }
}
