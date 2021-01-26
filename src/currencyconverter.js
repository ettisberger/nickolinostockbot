var axios = require('axios');

module.exports = {
  convertCurrency: function convertCurrency(amount, fromCurrency, toCurrency, cb) {
    var apiKey = process.env.CURRENCY_CONVERTER_API_KEY;

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    var query = fromCurrency + '_' + toCurrency;

    axios.get(process.env.CURRENCY_CONVERTER_API_BASE_URL + '/api/v7/convert', {
        params: {
          q: query,
          apiKey
        }
      })
      .then(function (response) {
        console.log(response);

        if(response.data.results){
          const rate = Object.keys(response.data.results)[0].val;
          var total = rate * amount;
          cb(null, Math.round(total * 100) / 100);
        } else {
          var err = new Error("Value not found for " + query);
          cb(err);
        }
      })
      .catch(function (error) {
          console.log(error);
          var err = new Error("Parse error for " + query);
          cb(err);
      })
    }
};
