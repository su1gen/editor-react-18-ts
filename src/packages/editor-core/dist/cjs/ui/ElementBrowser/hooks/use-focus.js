"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFocus;

var _react = require("react");

function useFocus(focus) {
  var ref = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(function () {
    var current = ref.current;

    if (focus && current && document.activeElement !== current) {
      current.focus({
        preventScroll: true
      });
    }
  }, [focus]);
  return ref;
}