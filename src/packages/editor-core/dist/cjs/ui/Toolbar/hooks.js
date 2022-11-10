"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useElementWidth = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var useElementWidth = function useElementWidth(ref, _ref) {
  var skip = _ref.skip;

  var _React$useState = _react.default.useState(undefined),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      elementWidth = _React$useState2[0],
      setWidth = _React$useState2[1];

  _react.default.useEffect(function () {
    if (!skip && ref.current) {
      setWidth(Math.round(ref.current.getBoundingClientRect().width));
    }
  }, [skip, setWidth, ref]);

  return elementWidth;
};

exports.useElementWidth = useElementWidth;