"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.BlockTypeButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _textStyle = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/text-style"));

var _ToolbarButton = _interopRequireDefault(require("../../../../ui/ToolbarButton"));

var _styles = require("../../../../ui/styles");

var _types = require("../../types");

/** @jsx jsx */
var messages = (0, _reactIntlNext.defineMessages)({
  textStyles: {
    id: 'fabric.editor.textStyles',
    defaultMessage: 'Text styles',
    description: 'Menu provides access to various heading styles or normal text'
  }
});
exports.messages = messages;

var BlockTypeButton = function BlockTypeButton(props) {
  var labelTextStyles = props.formatMessage(messages.textStyles);
  return (0, _react2.jsx)(_ToolbarButton.default, {
    spacing: props.isReducedSpacing ? 'none' : 'default',
    selected: props.selected,
    className: "block-type-btn",
    disabled: props.disabled,
    onClick: props.onClick,
    title: labelTextStyles,
    "aria-label": labelTextStyles,
    "aria-haspopup": true,
    "aria-expanded": props['aria-expanded'],
    iconAfter: (0, _react2.jsx)("span", {
      css: [_styles.wrapperStyle, props.isSmall && _styles.wrapperSmallStyle]
    }, props.isSmall && (0, _react2.jsx)(_textStyle.default, {
      label: labelTextStyles
    }), (0, _react2.jsx)("span", {
      css: _styles.expandIconWrapperStyle
    }, (0, _react2.jsx)(_chevronDown.default, {
      label: ""
    })))
  }, !props.isSmall && (0, _react2.jsx)("span", {
    css: [_styles.buttonContentStyle, props.isReducedSpacing && _styles.buttonContentReducedSpacingStyle]
  }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, props.title || _types.NORMAL_TEXT.title), (0, _react2.jsx)("div", {
    style: {
      overflow: 'hidden',
      height: 0
    }
  }, props.children)));
};

exports.BlockTypeButton = BlockTypeButton;