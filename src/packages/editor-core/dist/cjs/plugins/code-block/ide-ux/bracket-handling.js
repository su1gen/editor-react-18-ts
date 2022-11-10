"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldAutoCloseBracket = exports.getAutoClosingBracketInfo = exports.BRACKET_MAP = void 0;
var BRACKET_MAP = {
  '{': '}',
  '[': ']',
  '(': ')'
};
exports.BRACKET_MAP = BRACKET_MAP;

var shouldAutoCloseBracket = function shouldAutoCloseBracket(before, after) {
  // when directly before a closing bracket
  if (/^[}\])]/.test(after)) {
    return true;
  } // exclusion: when directly before a non-whitespace character


  if (/^[^\s]/.test(after)) {
    return false;
  }

  return true;
};

exports.shouldAutoCloseBracket = shouldAutoCloseBracket;

var getAutoClosingBracketInfo = function getAutoClosingBracketInfo(before, after) {
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

exports.getAutoClosingBracketInfo = getAutoClosingBracketInfo;