const axios = require('axios').default;

module.exports = {
  convert: async function (ctx, amount, fromCurrency, toCurrency) {

    try {
      const calculatedAmount = await this.convertCurrency(amount, fromCurrency, toCurrency);
      ctx.replyWithMarkdown(`${amount} ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()} is *${calculatedAmount} ${toCurrency.toUpperCase()}*`);
    }
    catch (error) {
      ctx.reply(`Could not convert currencies.`);
      console.log(error);
    }
  },
  convertCurrency: async function (amount, fromCurrency, toCurrency) {
    const apiKey = process.env.CURRENCY_CONVERTER_API_KEY;

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    const query = fromCurrency + '_' + toCurrency;

    try {
      const response = await axios.get(process.env.CURRENCY_CONVERTER_API_BASE_URL + '/api/v7/convert',
        {
          params: {
            q: query,
            apiKey
          }
        })

      if (response.data.results) {
        const key = Object.keys(response.data.results)[0];
        const rate = response.data.results[key].val;
        const total = rate * amount;

        return Math.round(total * 100) / 100;
      } else {
        // cb(err);
        return new Error("Value not found for " + query);
      }

    }
    catch (error) {
      console.log(error);
      return new Error("Parse error for " + query);
    }
  }
};
