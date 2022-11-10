"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _constants = require("@atlaskit/theme/constants");

var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/cross-circle"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _messages = require("../messages");

var _templateObject, _templateObject2, _templateObject3;

var removableFieldWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  margin-bottom: 0;\n"])));
var wrapperWithMarginBottom = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin-bottom: ", "px;\n"])), (0, _constants.gridSize)() * 2);
var removeButtonWrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n\n  color: ", ";\n\n  &:hover {\n    color: ", ";\n  }\n"])), (0, _tokens.token)('color.icon.subtle', _colors.N80), (0, _tokens.token)('color.icon.danger', _colors.R300));

var RemovableField = function RemovableField(_ref) {
  var _children$props$field;

  var name = _ref.name,
      canRemoveField = _ref.canRemoveField,
      onClickRemove = _ref.onClickRemove,
      children = _ref.children,
      intl = _ref.intl,
      className = _ref.className;

  var onClickCallback = _react.default.useCallback(function () {
    return onClickRemove && onClickRemove(name);
  }, [name, onClickRemove]);

  var hasMarginBottom = ((_children$props$field = children.props.field) === null || _children$props$field === void 0 ? void 0 : _children$props$field.type) !== 'expand';
  return (0, _react2.jsx)("div", {
    css: [removableFieldWrapper, hasMarginBottom && wrapperWithMarginBottom],
    className: className
  }, children, canRemoveField && (0, _react2.jsx)("div", {
    css: removeButtonWrapper,
    "data-testid": "remove-field-".concat(name),
    onClick: onClickCallback
  }, (0, _react2.jsx)(_tooltip.default, {
    content: intl.formatMessage(_messages.messages.removeField),
    position: "left"
  }, (0, _react2.jsx)(_crossCircle.default, {
    size: "small",
    label: intl.formatMessage(_messages.messages.removeField)
  }))));
};

var _default = (0, _reactIntlNext.injectIntl)(RemovableField);

exports.default = _default;