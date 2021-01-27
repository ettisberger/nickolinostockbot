const casinoKeywords = ["trade", "play", "drop", "buy high sell low"];
const moonKeywords = ["to the mo+n"];
const momKeywords = ["crash"];
const investKeywords = ["invest"];

module.exports = {
  onText: function(ctx, text) {
    if(containsToTheMoonText(ctx.message.text)){
      ctx.replyWithMarkdown(`\n\u{1F680} \u{1F680} \u{1F680} \u{1F680} \u{1F680}\n`);
    }

    if(containsCasinoText(ctx.message.text)){
      ctx.replyWithMarkdown(`\n\u{1F680} Sir, this is a casino. \u{1F680}\n`);
    }

    if(containsMomText(ctx.message.text)){
      ctx.replyWithMarkdown(`\n"Hello mom? Is my old room still available?"\n`);
    }

    if(containsInvestText(ctx.message.text)){
      ctx.replyWithMarkdown(`\nIf you don't find a way to make money while you sleep, you will work until you die.\n`);
    }
  }
}

function containsToTheMoonText(text) {
  return moonKeywords.filter(function (pattern) {
    return new RegExp(pattern).test(text);
  }).length >= 1;
}

function containsCasinoText(text) {
  return text != null && (casinoKeywords.includes(text.toLowerCase()));
}

function containsMomText(text) {
  return momKeywords.filter(function (pattern) {
    return new RegExp(pattern).test(text);
  }).length >= 1;
}

function containsInvestText(text) {
  return text != null && (investKeywords.includes(text.toLowerCase()));
}
