const admins = require("./admins");
const axios = require("axios");
const Parse = require('parse/node');
const currencyConverter = require("./currencyconverter")
const iex = require("./iex")

Parse.serverURL = process.env.PARSE_SERVER_URL;
Parse.initialize(
  process.env.PARSE_APPLICATION_ID,
  process.env.PARSE_JS_KEY,
  process.env.PARSE_MASTER_KEY
);

module.exports = {
  portfolio: async function (ctx, parameters) {
    const command = parameters[1];

    if (admins.includes(ctx.from.username)) {
      if (command === "create") {
        await create(ctx, parameters[2]);
      } else if (command === "remove") {
        await remove(ctx, parameters[2]);
      } else if (command === "print") {
        await print(ctx, parameters[2]);
      } else {
        if (parameters[2]) {
          await set(ctx, parameters);
        } else {
          ctx.reply(`Missing portfolio name.`);
        }
      }
    } else {
      ctx.reply(`You are not an admin user, sorry :( (hehehe)`);
    }
  }
};

async function create(ctx, name) {
  const query = new Parse.Query("TelegramUser");
  query.equalTo("telegramId", ctx.from.username);
  const users = await query.find();

  if (!users || !users[0]) {
    ctx.reply(`Cant find admin user, sorry :(`);
  } else {
    const query = new Parse.Query("Portfolio");
    query.equalTo("name", name);
    const portfolios = await query.find();

    if (Array.isArray(portfolios) && portfolios.length) {
      ctx.reply(`Portfolio already exists.`);
    } else {
      const Portfolio = Parse.Object.extend('Portfolio');
      const newPortfolio = new Portfolio();
      newPortfolio.set('name', name);
      newPortfolio.set('entries', []);
      newPortfolio.set('telegramUser', users[0]);

      newPortfolio.save().then(
        (result) => {
          ctx.reply(`Created portfolio: ${result.get("name")}`);
        },
        (error) => {
          console.error('Error while creating Portfolio: ', error);
        }
      );
    }
  }
}

async function remove(ctx, name) {
  const query = new Parse.Query("Portfolio");
  query.equalTo("name", name);
  const portfolios = await query.find();

  portfolios.forEach(p => {
    if (p) {
      ctx.reply(`Removed portfolio: ${p.get("name")}`);
      p.destroy();
    } else {
      ctx.reply(`Can't remove portfolio: ${name}`);
    }
  })
}

async function set(ctx, parameters) {
  if (parameters.length !== 6) {
    ctx.reply(`Missing parameters. Add portfolio entry with /portfolio <name> set <symbol> <quantity> <currency>`);
  } else {
    const portfolioName = parameters[1];
    const symbol = parameters[3];
    const quantity = parameters[4];
    const currency = parameters[5];

    const query = new Parse.Query("Portfolio");
    query.equalTo("name", portfolioName);
    const portfolios = await query.find();

    if (Array.isArray(portfolios) && portfolios.length === 1) {
      const portfolio = portfolios[0];

      const PortfolioEntry = Parse.Object.extend('PortfolioEntry');
      const entry = new PortfolioEntry();
      entry.set('symbol', symbol.toUpperCase());
      entry.set('quantity', Number.parseFloat(quantity));
      entry.set('currency', currency.toUpperCase());
      entry.set('portfolio', portfolio);

      entry.save().then(
        (result) => {
          ctx.reply(`Added portfolio entry: ${result.get("symbol").toUpperCase()}, ${result.get(
            "quantity")}, ${result.get("currency")}`);
        },
        (error) => {
          console.log(error)
          ctx.reply(`Could not add entry to portfolio ${portfolio.get("name")}`);
        }
      );
    }
  }
}

async function print(ctx, name) {
  const username = ctx.message.from.username;

  let query = new Parse.Query("Portfolio");
  query.equalTo("name", name);
  const portfolios = await query.find();

  const userQuery = new Parse.Query(portfolios[0].get("telegramUser"));
  const user = await userQuery.find();
  const telegramId = user[0].get("telegramId");

  if (telegramId === username) {
    const PortfolioEntry = Parse.Object.extend('PortfolioEntry');
    query = new Parse.Query(PortfolioEntry);
    query.equalTo("portfolio", portfolios[0]);
    const entries = await query.find();

    let entryString = `Portfolio ${name}\n\n`;
    let total = 0;

    for (const e of entries) {
      const quote = await iex.quote(e.get("symbol"));
      const ratingAmount = quote.latestPrice * e.get("quantity");
      const amount = await currencyConverter.test(ratingAmount, e.get("currency"), "CHF");
      total += amount;
      entryString += `${e.get("symbol")}\t\t${e.get("quantity")}\t\t(${ratingAmount.toFixed(2)} ${e.get(
        "currency")})\n`;
    }

    entryString += `\nTotal *${total.toFixed(2)} CHF*\n`;

    await ctx.replyWithMarkdown(entryString);
  } else {
    ctx.replyWithMarkdown("This is not your own portfolio.");
  }

}
