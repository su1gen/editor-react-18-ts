"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEscapeClickaway = void 0;

var _react = require("react");

var useEscapeClickaway = function useEscapeClickaway(onEscape, onClickAway) {
  var ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    var handleClickAway = function handleClickAway(event) {
      var el = ref.current;

      if (event.target instanceof Element && el && !el.contains(event.target)) {
        onClickAway();
      }
    };

    var handleKeydown = function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleKeydown);
    return function () {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClickAway, onEscape]);
  return ref;
};

exports.useEscapeClickaway = useEscapeClickaway;