const casinoKeywords = ["trade", "play", "drop", "buy high sell low", "to the mo+n", "crash", "invest"];
const quotes = [
  `\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`,
  `\n\u{1F680} Sir, this is a casino. \u{1F680}\n`,
  `\n"Hello mom? Is my old room still available?"\n`,
  `\nIf you don't find a way to make money while you sleep, you will work until you die.\n`
];

module.exports = {
  onText: function (ctx, text) {
    const matches = casinoKeywords.filter(function (pattern) {
      return new RegExp(pattern).test(text.toLowerCase());
    }).length >= 1;

    if (matches) {
      const randomNumber = Math.random();

      if (randomNumber <= 0.2) {
        ctx.replyWithMarkdown(quotes[randomNumberInRange(0, quotes.length - 1)])
      }
    }
  }
}

function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
