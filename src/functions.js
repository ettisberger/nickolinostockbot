const { IEXCloudClient } = require("node-iex-cloud");
const axios = require("axios");

const iex = new IEXCloudClient(axios, {
  sandbox: false,
  publishable: process.env.STOCK_REST_API_KEY,
  version: "stable"
})

module.exports = {
  info: function (ctx, symbol) {
    iex.symbol(symbol).company().then(data => {
      console.log(data)
      ctx.reply(`$${symbol}\n\
      Company: ${data.companyName}\n\
      Exchange: ${data.exchange}\n\
      Industry: ${data.industry}\n\
      Website: ${data.website}\n\
      country: ${data.country}\n\
      city: ${data.city}\n\
      CEO: ${data.CEO}\n\
      `)
    });
  },
  latest: function (ctx, symbol) {
    iex.symbol(symbol).quote().then(response => {
      console.log(response)

      ctx.replyWithMarkdown(`$${response.symbol} (${response.companyName}, ${response.primaryExchange})\
      \nLast available stock price is *$${response.latestPrice}*. \
      \nDaily change: *${(response.changePercent * 100).toFixed(2)}%* ($${response.change})\
      \n\nLast update ${new Date(response.latestUpdate)}\
      \nSource: ${response.latestSource}`);
    }).catch(error => {
      console.log(error);
      ctx.reply(`Damn something went wrong >__>`);
    });
  },
  cryptos: function (ctx, symbol) {
    iex.crypto(symbol).quote().then(data => {
      console.log(data)

      ctx.replyWithMarkdown(`$${data.symbol} last available crypto price is *${data.latestPrice}*.\
      \nDaily H/L: ${data.high ? data.high : "missing"}/${data.low ? data.low : "missing"}.\
      \nPrevious close: ${data.previousClose ? data.previousClose : "missing"}\
      \n\nLast update ${new Date(data.latestUpdate)}.\
      \nSource: ${data.latestSource}`);

    }).catch(error => {
      console.log(error);
      ctx.reply(`Damn something went wrong >__>`);
    })
  },
  dividends: function (ctx, symbol) {
    iex.symbol(symbol).dividends('dynamic').then(response => {
      if (response.length === 0) {
        ctx.reply(`No dividends found for symbol $${symbol}.`);
      } else {
        const data = response[0];
        ctx.replyWithMarkdown(`$${data.symbol} pays out *${data.amount} ${data.currency}*. Last payment on ${data.paymentDate}`);
      }
    }).catch(error => {
      console.log(error);
      ctx.reply(`Damn something went wrong >__>`);
    })
  },
  convert: function (ctx, amount, currencyFrom, currencyTo) {
    iex.symbol(`${currencyFrom}${currencyTo}`).forex().convert({ amount, symbols: ["CHFUSD"] }).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error);
      ctx.reply(`Damn something went wrong >__>`);
    })
  }
};
