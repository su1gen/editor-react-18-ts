"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusNodeView = exports.IntlStatusContainerView = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _element = require("@atlaskit/status/element");

var _messages = require("./messages");

var _templateObject, _templateObject2;

var styledStatus = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  opacity: 1;\n"])));
var styledStatusPlaceholder = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  opacity: 0.5;\n"])));

var StatusContainerView = function StatusContainerView(props) {
  var text = props.text,
      color = props.color,
      localId = props.localId,
      style = props.style,
      formatMessage = props.intl.formatMessage;
  var statusText = text ? text : formatMessage(_messages.messages.placeholder);

  var handleClick = function handleClick(event) {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    } // handling of popup is done in plugin.apply on selection change.

  };

  return (0, _react2.jsx)("span", {
    css: text ? styledStatus : styledStatusPlaceholder
  }, (0, _react2.jsx)(_element.Status, {
    text: statusText,
    color: color,
    localId: localId,
    style: style,
    onClick: handleClick
  }));
};

var IntlStatusContainerView = (0, _reactIntlNext.injectIntl)(StatusContainerView);
exports.IntlStatusContainerView = IntlStatusContainerView;

var StatusNodeView = function StatusNodeView(props) {
  var view = props.view;
  var _props$node$attrs = props.node.attrs,
      text = _props$node$attrs.text,
      color = _props$node$attrs.color,
      localId = _props$node$attrs.localId,
      style = _props$node$attrs.style;
  return (0, _react2.jsx)(IntlStatusContainerView, {
    view: view,
    text: text,
    color: color,
    style: style,
    localId: localId
  });
};

exports.StatusNodeView = StatusNodeView;