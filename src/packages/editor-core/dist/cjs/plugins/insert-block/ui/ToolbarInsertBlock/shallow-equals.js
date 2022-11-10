"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowEquals = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var shallowEquals = function shallowEquals(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 1),
      aRaw = _ref3[0];

  var _ref4 = (0, _slicedToArray2.default)(_ref2, 1),
      bRaw = _ref4[0];

  var a = aRaw;
  var b = bRaw;
  return !Object.keys(a).some(function (key) {
    var k = key;
    return a[k] !== b[k];
  });
};

exports.shallowEquals = shallowEquals;