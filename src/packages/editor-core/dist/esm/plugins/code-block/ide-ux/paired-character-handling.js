import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { BRACKET_MAP } from './bracket-handling';
import { QUOTE_MAP } from './quote-handling';

var PAIRED_CHARACTER_MAP = _objectSpread(_objectSpread({}, BRACKET_MAP), QUOTE_MAP);

export var isCursorBeforeClosingCharacter = function isCursorBeforeClosingCharacter(after) {
  return Object.keys(PAIRED_CHARACTER_MAP).some(function (leftCharacter) {
    return after.startsWith(PAIRED_CHARACTER_MAP[leftCharacter]);
  });
};
export var isClosingCharacter = function isClosingCharacter(text) {
  return Object.keys(PAIRED_CHARACTER_MAP).some(function (leftCharacter) {
    return text === PAIRED_CHARACTER_MAP[leftCharacter];
  });
};