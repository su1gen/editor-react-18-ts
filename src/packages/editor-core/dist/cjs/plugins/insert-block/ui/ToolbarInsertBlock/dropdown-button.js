"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropDownButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _add = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/add"));

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _keymaps = require("../../../../keymaps");

var _ToolbarButton = _interopRequireDefault(require("../../../../ui/ToolbarButton"));

var _styles = require("../../../../ui/styles");

var _styles2 = require("./styles");

/** @jsx jsx */
var DropDownButtonIcon = /*#__PURE__*/_react.default.memo(function (props) {
  return (0, _react2.jsx)("span", {
    css: _styles2.triggerWrapper
  }, (0, _react2.jsx)(_add.default, {
    label: props.label
  }), (0, _react2.jsx)("span", {
    css: _styles.expandIconWrapperStyle
  }, (0, _react2.jsx)(_chevronDown.default, {
    label: ""
  })));
});

var DropDownButton = /*#__PURE__*/_react.default.memo(function (props) {
  return (0, _react2.jsx)(_ToolbarButton.default, {
    ref: props.handleRef,
    selected: props.selected,
    disabled: props.disabled,
    onClick: props.onClick,
    spacing: props.spacing,
    "aria-expanded": props['aria-expanded'],
    "aria-haspopup": props['aria-haspopup'],
    "aria-label": props.label,
    iconBefore: (0, _react2.jsx)(DropDownButtonIcon, {
      label: ""
    }),
    title: (0, _react2.jsx)(_keymaps.ToolTipContent, {
      description: props.label,
      shortcutOverride: "/"
    })
  });
});

exports.DropDownButton = DropDownButton;