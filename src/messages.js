const casinoKeywords = ["trade", "play", "drop", "buy high sell low", "to the mo+n", "crash", "invest"];
const quotes = [
  `\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`,
  `\n\u{1F680} Sir, this is a casino. \u{1F680}\n`,
  `\n"Hello mom? Is my old room still available?"\n`,
  `\nIf you don't find a way to make money while you sleep, you will work until you die.\n`,
  `\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`,
  `\nWhen it's raining gold, reach for a bucket, not a thimble.\n`,
  `\nHope is bogus emotion that only costs you money.\n`,
  `\n\u{1F680} Sir, this is a casino. \u{1F680}\n`,
  `\nThe market is a device for transferring money from the impatient to the patient.\n`,
  `\nThe market can stay irrational longer than you can stay solvent.\n`,
  `\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`,
  `\nThe question should not be how much I will profit on this trade! The true question is; will I be fine if I don't profit from this trade.\n`,
  `\n\u{1F680} Sir, this is a casino. \u{1F680}\n`,
  `\nWe simply attempt to be fearful when others are greedy and to be greedy only when others are fearful.\n`,
  `\nThe elements of good trading are (1) cutting losses, (2) cutting losses, and (3) cutting losses. If you can follow these three rules, you may have a chance.\n`,
  `\nOne of the funny things about the stock market is that every time one person buys, another sells, and both think they are astute.\n`,
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
