"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("@emotion/react");

var _styles = require("./styles");

/** @jsx jsx */
var DropdownItemWrapper = function DropdownItemWrapper(props) {
  return (0, _react.jsx)("div", {
    css: _styles.dropdownItem,
    onClick: function onClick() {
      return props.onClick && props.onClick({
        actionOnClick: props.actionOnClick,
        renderOnClick: props.renderOnClick
      });
    }
  }, (0, _react.jsx)("span", null, props.icon), props.children);
};

var _default = DropdownItemWrapper;
exports.default = _default;