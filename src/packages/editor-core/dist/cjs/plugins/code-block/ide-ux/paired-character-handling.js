"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCursorBeforeClosingCharacter = exports.isClosingCharacter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bracketHandling = require("./bracket-handling");

var _quoteHandling = require("./quote-handling");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var PAIRED_CHARACTER_MAP = _objectSpread(_objectSpread({}, _bracketHandling.BRACKET_MAP), _quoteHandling.QUOTE_MAP);

var isCursorBeforeClosingCharacter = function isCursorBeforeClosingCharacter(after) {
  return Object.keys(PAIRED_CHARACTER_MAP).some(function (leftCharacter) {
    return after.startsWith(PAIRED_CHARACTER_MAP[leftCharacter]);
  });
};

exports.isCursorBeforeClosingCharacter = isCursorBeforeClosingCharacter;

var isClosingCharacter = function isClosingCharacter(text) {
  return Object.keys(PAIRED_CHARACTER_MAP).some(function (leftCharacter) {
    return text === PAIRED_CHARACTER_MAP[leftCharacter];
  });
};

exports.isClosingCharacter = isClosingCharacter;