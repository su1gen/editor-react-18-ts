"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _cross = _interopRequireDefault(require("@atlaskit/icon/glyph/cross"));

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _messages = require("./messages");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

var iconWidth = 40;
var buttonWidth = 40;
var margin = 16;
var gapSizeForEllipsis = iconWidth + buttonWidth + margin * 2;
var item = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  margin-bottom: 24px;\n"])));
var itemIcon = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n  height: ", "px;\n  overflow: hidden;\n  border: 1px solid ", "; /* N60 at 50% */\n  border-radius: ", "px;\n  box-sizing: border-box;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  div {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), iconWidth, iconWidth, (0, _tokens.token)('color.border', 'rgba(223, 225, 229, 0.5)'), (0, _constants.borderRadius)(), iconWidth, iconWidth);
var itemBody = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n  margin: 0 16px;\n  flex-grow: 3;\n  max-width: calc(100% - ", "px);\n"])), gapSizeForEllipsis);
var centeredItemTitle = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"])));
var itemText = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  max-width: 100%;\n  white-space: initial;\n  .item-summary {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 4px;\n\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n"])), (0, _editorSharedStyles.relativeFontSizeToBase16)(11.67), (0, _tokens.token)('color.text.subtlest', _colors.N200));
var descriptionStyle = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  margin-bottom: 24px;\n"])));
var closeButtonWrapper = (0, _react2.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n  text-align: right;\n"])), buttonWidth);

var Header = function Header(_ref) {
  var icon = _ref.icon,
      title = _ref.title,
      description = _ref.description,
      summary = _ref.summary,
      documentationUrl = _ref.documentationUrl,
      onClose = _ref.onClose,
      intl = _ref.intl;
  var ResolvedIcon = (0, _reactLoadable.default)({
    loader: icon,
    loading: function loading() {
      return null;
    }
  });
  return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", {
    css: item
  }, (0, _react2.jsx)("div", {
    css: itemIcon
  }, (0, _react2.jsx)(ResolvedIcon, {
    label: title
  })), (0, _react2.jsx)("div", {
    css: itemBody
  }, summary ? (0, _react2.jsx)("div", {
    css: itemText
  }, (0, _react2.jsx)("div", {
    className: "item-title",
    id: "context-panel-title"
  }, title), (0, _react2.jsx)("div", {
    className: "item-summary"
  }, summary)) : (0, _react2.jsx)("div", {
    css: centeredItemTitle,
    id: "context-panel-title"
  }, title)), (0, _react2.jsx)("div", {
    css: closeButtonWrapper
  }, (0, _react2.jsx)(_customThemeButton.default, {
    appearance: "subtle",
    iconBefore: (0, _react2.jsx)(_cross.default, {
      label: intl.formatMessage(_messages.messages.close)
    }),
    onClick: onClose
  }))), (description || documentationUrl) && (0, _react2.jsx)("p", {
    css: descriptionStyle
  }, description && (0, _react2.jsx)(_react.Fragment, null, description.replace(/([^.])$/, '$1.'), " "), documentationUrl && (0, _react2.jsx)("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: documentationUrl
  }, intl.formatMessage(_messages.messages.documentation))));
};

var _default = (0, _reactIntlNext.injectIntl)(Header);

exports.default = _default;