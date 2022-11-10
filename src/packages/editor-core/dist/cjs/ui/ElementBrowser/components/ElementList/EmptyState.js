"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EmptyState;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _button = _interopRequireDefault(require("@atlaskit/button"));

var _NotFoundIllustration = _interopRequireDefault(require("./NotFoundIllustration"));

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function EmptyState(_ref) {
  var onExternalLinkClick = _ref.onExternalLinkClick;
  return (0, _react.jsx)("div", {
    css: emptyStateWrapper
  }, (0, _react.jsx)(_NotFoundIllustration.default, null), (0, _react.jsx)("div", {
    css: emptyStateHeading
  }, (0, _react.jsx)(_reactIntlNext.FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.heading",
    defaultMessage: "Nothing matches your search",
    description: "Empty state heading"
  })), (0, _react.jsx)("div", {
    css: emptyStateSubHeading
  }, (0, _react.jsx)("p", null, (0, _react.jsx)(_reactIntlNext.FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.sub-heading",
    defaultMessage: "Try searching with a different term or discover new apps for Atlassian products.",
    description: "Empty state sub-heading"
  })), (0, _react.jsx)("div", {
    css: externalLinkWrapper
  }, (0, _react.jsx)(_button.default, {
    appearance: "primary",
    target: "_blank",
    href: "https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence",
    onClick: onExternalLinkClick
  }, (0, _react.jsx)(_reactIntlNext.FormattedMessage, {
    id: "fabric.editor.elementbrowser.search.empty-state.sub-heading.link",
    defaultMessage: "Explore Atlassian Marketplace",
    description: "Empty state sub-heading external link"
  })))));
}

var emptyStateHeading = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  font-size: 1.42857em;\n  line-height: 1.2;\n  color: ", ";\n  font-weight: 500;\n  letter-spacing: -0.008em;\n  margin-top: 28px;\n"])), (0, _tokens.token)('color.text', 'rgb(23, 43, 77)'));
var emptyStateSubHeading = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin-top: 16px;\n  max-width: 400px;\n  text-align: center;\n"])));
var emptyStateWrapper = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n"])));
var externalLinkWrapper = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  margin-top: 14px;\n"])));