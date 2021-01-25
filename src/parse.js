const admins = require("./admins");
const axios = require("axios");
const Parse = require('parse/node');

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
      ctx.reply(`You are not an admin user, sorry :(`);
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

    if(Array.isArray(portfolios) && portfolios.length){
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
  if (parameters.length !== 5) {
    ctx.reply(`Missing parameters. Add portfolio entry with /portfolio <name> set <symbol> <quantity>`);
  } else {
    const portfolioName = parameters[1];
    const symbol = parameters[3];
    const quantity = parameters[4];

    const query = new Parse.Query("Portfolio");
    query.equalTo("name", portfolioName);
    const portfolios = await query.find();

    if (Array.isArray(portfolios) && portfolios.length === 1) {
      const portfolio = portfolios[0];

      const PortfolioEntry = Parse.Object.extend('PortfolioEntry');
      const entry = new PortfolioEntry();
      entry.set('symbol', symbol.toUpperCase());
      entry.set('quantity', Number.parseFloat(quantity));
      entry.set('portfolio', portfolio);

      entry.save().then(
        (result) => {
          ctx.reply(`Added portfolio entry: ${result.get("symbol").toUpperCase()}, ${result.get("quantity")}`);
        },
        (error) => {
          console.log(error)
          ctx.reply(`Could not add entry to portfolio ${portfolio.get("name")}`);
        }
      );
    }
  }
}

async function print(ctx, name){
  let query = new Parse.Query("Portfolio");
  query.equalTo("name", name);
  const portfolios = await query.find();

  const PortfolioEntry = Parse.Object.extend('PortfolioEntry');
  query = new Parse.Query(PortfolioEntry);
  query.equalTo("portfolio", portfolios[0]);
  const entries = await query.find();

  let entryString = `Portfolio ${name}\n\n`;

  entries.forEach(e => {
    entryString += `${e.get("symbol")} => ${e.get("quantity")}\n`;
  })

  await ctx.replyWithMarkdown(entryString);
}
