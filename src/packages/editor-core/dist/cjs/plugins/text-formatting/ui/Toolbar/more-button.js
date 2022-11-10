"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoreButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _more = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/more"));

var _styles = require("../../../../ui/styles");

var _ToolbarButton = _interopRequireDefault(require("../../../../ui/ToolbarButton"));

/** @jsx jsx */
var MoreButton = /*#__PURE__*/_react.default.memo(function (_ref) {
  var label = _ref.label,
      ariaExpanded = _ref['aria-expanded'],
      isReducedSpacing = _ref.isReducedSpacing,
      isSelected = _ref.isSelected,
      isDisabled = _ref.isDisabled,
      onClick = _ref.onClick;
  return (0, _react2.jsx)(_ToolbarButton.default, {
    disabled: isDisabled,
    selected: isSelected,
    onClick: onClick,
    spacing: isReducedSpacing ? 'none' : 'default',
    title: label,
    iconBefore: (0, _react2.jsx)("div", {
      css: _styles.triggerWrapperStyles
    }, (0, _react2.jsx)(_more.default, {
      label: ""
    })),
    "aria-expanded": ariaExpanded,
    "aria-label": label,
    "aria-haspopup": true
  });
});

exports.MoreButton = MoreButton;