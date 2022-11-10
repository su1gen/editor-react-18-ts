"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SaveIndicator = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _checkCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/check-circle"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3;

var noop = function noop() {};

var saveIndicatorWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: center;\n"])));
var saveIndicatorContent = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  position: fixed;\n  width: 256px;\n  bottom: 20px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 6px 12px;\n\n  background: ", ";\n\n  /* E300 */\n  box-shadow: ", ";\n  border-radius: 16px;\n"])), (0, _tokens.token)('elevation.surface.overlay', _colors.N0), (0, _tokens.token)('elevation.shadow.overlay', "0px 8px 12px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)"));
var saveIndicatorText = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  padding-left: 6px;\n"])));

var SaveIndicator = function SaveIndicator(_ref) {
  var children = _ref.children,
      duration = _ref.duration,
      _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      saving = _useState2[0],
      setSaving = _useState2[1];

  var shown = (0, _react.useRef)(false);
  var onSaveStarted = (0, _react.useCallback)(function () {
    if (!shown.current) {
      setSaving(true);
      shown.current = true;
    }
  }, []);
  (0, _react.useEffect)(function () {
    if (saving) {
      var handleId = setTimeout(function () {
        setSaving(false);
      }, duration);
      return function () {
        return clearTimeout(handleId);
      };
    }
  }, [saving, duration]);
  return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", null, children({
    onSaveStarted: onSaveStarted,
    onSaveEnded: noop
  })), visible && saving && (0, _react2.jsx)("div", {
    css: saveIndicatorWrapper
  }, (0, _react2.jsx)("div", {
    css: saveIndicatorContent,
    "data-testid": "save-indicator-content"
  }, (0, _react2.jsx)(_checkCircle.default, {
    label: "Saving",
    primaryColor: (0, _tokens.token)('color.icon.success', _colors.G300),
    size: "small"
  }), (0, _react2.jsx)("span", {
    css: saveIndicatorText
  }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _messages.messages.saveIndicator)))));
};

exports.SaveIndicator = SaveIndicator;