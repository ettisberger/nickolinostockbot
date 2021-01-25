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

async function remove(ctx, name) {
  const query = new Parse.Query("Portfolio");
  query.equalTo("name", name);
  const portfolios = await query.find();

  portfolios.forEach(p => {
    if(p){
      ctx.reply(`Removed portfolio: ${p.get("name")}`);
      p.destroy();
    } else {
      ctx.reply(`Can't remove portfolio: ${name}`);
    }
  })
}
