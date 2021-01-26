const axios = require('axios');

module.exports = {
  convert: function(ctx, amount, fromCurrency, toCurrency){
    this.convertCurrency(amount, fromCurrency, toCurrency, function(err, amountConverted) {
      if(err){
        ctx.reply(`Could not convert currencies.`);
        console.log(err);
      } else {
        ctx.replyWithMarkdown(`${amount} ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()} is *${amountConverted} ${toCurrency.toUpperCase()}*`);
      }
    });
  },
  convertCurrency: function(amount, fromCurrency, toCurrency, cb) {
    const apiKey = process.env.CURRENCY_CONVERTER_API_KEY;

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    const query = fromCurrency + '_' + toCurrency;

    axios.get(process.env.CURRENCY_CONVERTER_API_BASE_URL + '/api/v7/convert', {
        params: {
          q: query,
          apiKey
        }
      })
      .then(function (response) {
        if(response.data.results){
          console.log(Object.keys(response.data.results));
          const key = Object.keys(response.data.results)[0];
          const rate = response.data.results[key].val;
          const total = rate * amount;
          cb(null, Math.round(total * 100) / 100);
        } else {
          const err = new Error("Value not found for " + query);
          cb(err);
        }
      })
      .catch(function (error) {
          console.log(error);
          const err = new Error("Parse error for " + query);
          cb(err);
      })
    }
};
