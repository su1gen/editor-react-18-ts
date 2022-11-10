export var BRACKET_MAP = {
  '{': '}',
  '[': ']',
  '(': ')'
};
export var shouldAutoCloseBracket = function shouldAutoCloseBracket(before, after) {
  // when directly before a closing bracket
  if (/^[}\])]/.test(after)) {
    return true;
  } // exclusion: when directly before a non-whitespace character


  if (/^[^\s]/.test(after)) {
    return false;
  }

  return true;
};
export var getAutoClosingBracketInfo = function getAutoClosingBracketInfo(before, after) {
  var left = Object.keys(BRACKET_MAP).find(function (item) {
    return before.endsWith(item);
  });
  var right = left ? BRACKET_MAP[left] : undefined;
  var hasTrailingMatchingBracket = right ? after.startsWith(right) : false;
  return {
    left: left,
    right: right,
    hasTrailingMatchingBracket: hasTrailingMatchingBracket
  };
};