export var QUOTE_MAP = {
  "'": "'",
  '"': '"',
  '`': '`'
};
export var shouldAutoCloseQuote = function shouldAutoCloseQuote(before, after) {
  // when directly before a closing bracket
  if (/^[}\])]/.test(after)) {
    return true;
  } // exclusion: when directly before a non-whitespace character


  if (/^[^\s]/.test(after)) {
    return false;
  } // exclusion: when directly after a letter or quote


  if (/[A-Za-z0-9]$/.test(before) || /[\'\"\`]$/.test(before)) {
    return false;
  }

  return true;
};
export var getAutoClosingQuoteInfo = function getAutoClosingQuoteInfo(before, after) {
  var left = Object.keys(QUOTE_MAP).find(function (item) {
    return before.endsWith(item);
  });
  var right = left ? QUOTE_MAP[left] : undefined;
  var hasTrailingMatchingQuote = right ? after.startsWith(right) : false;
  return {
    left: left,
    right: right,
    hasTrailingMatchingQuote: hasTrailingMatchingQuote
  };
};