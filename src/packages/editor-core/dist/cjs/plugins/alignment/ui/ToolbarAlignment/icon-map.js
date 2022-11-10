"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconMap = void 0;

var _alignLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-left"));

var _alignRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-right"));

var _alignCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-center"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

var _react = _interopRequireDefault(require("react"));

var iconAndMessageMap = {
  start: {
    Component: _alignLeft.default,
    label: _messages.messages.alignLeft
  },
  end: {
    Component: _alignRight.default,
    label: _messages.messages.alignRight
  },
  center: {
    Component: _alignCenter.default,
    label: _messages.messages.alignCenter
  }
};

var IconMap = function IconMap(props) {
  var _iconAndMessageMap$pr = iconAndMessageMap[props.alignment],
      Component = _iconAndMessageMap$pr.Component,
      label = _iconAndMessageMap$pr.label;
  var intl = (0, _reactIntlNext.useIntl)();
  return /*#__PURE__*/_react.default.createElement(Component, {
    label: intl.formatMessage(label)
  });
};

exports.IconMap = IconMap;