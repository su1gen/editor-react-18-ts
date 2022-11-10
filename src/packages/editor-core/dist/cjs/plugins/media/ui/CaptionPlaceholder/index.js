"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CAPTION_PLACEHOLDER_ID = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _messages = require("./messages");

var _templateObject;

var placeholder = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  width: 100%;\n  text-align: center;\n  margin-top: 8px !important;\n  display: block;\n"])), (0, _tokens.token)('color.text.subtlest', _colors.N200));
var CAPTION_PLACEHOLDER_ID = 'caption-placeholder';
exports.CAPTION_PLACEHOLDER_ID = CAPTION_PLACEHOLDER_ID;

var _default = function _default(_ref) {
  var onClick = _ref.onClick;
  return (0, _react.jsx)("span", {
    css: placeholder,
    onClick: onClick,
    "data-id": CAPTION_PLACEHOLDER_ID,
    "data-testid": "caption-placeholder"
  }, (0, _react.jsx)(_reactIntlNext.FormattedMessage, _messages.messages.placeholder));
};

exports.default = _default;