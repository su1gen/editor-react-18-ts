"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByOrder = sortByOrder;

var _rank = _interopRequireDefault(require("../plugins/rank"));

function sortByOrder(item) {
  return function (a, b) {
    return _rank.default[item].indexOf(a.name) - _rank.default[item].indexOf(b.name);
  };
}