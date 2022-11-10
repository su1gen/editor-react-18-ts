"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkToolbarButtonGroup = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _button = require("@atlaskit/button");

var _Button = _interopRequireDefault(require("../../floating-toolbar/ui/Button"));

var _excluded = ["disabled"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */
var buttonStyle = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  pointer-events: auto;\n"])));
var buttonStyleNoneEvent = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  pointer-events: none;\n"])));

var DisallowedWrapper = function DisallowedWrapper(_ref) {
  var disabled = _ref.disabled,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  return (0, _react2.jsx)("div", props);
};
/**
 * The button requires `pointer-events: none;` in order to fix the tooltip, hence
 * leaving us without a disabled cursor, the following fixes this:
 */


var defaultWrapperStyle = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  cursor: pointer;\n"])));
var disallowedWrapperStyle = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  cursor: not-allowed;\n"])));

var LinkToolbarButtonGroup = function LinkToolbarButtonGroup(_ref2) {
  var options = _ref2.options;
  return (0, _react2.jsx)(_button.ButtonGroup, null, options.map(function (_ref3) {
    var onClick = _ref3.onClick,
        selected = _ref3.selected,
        disabled = _ref3.disabled,
        testId = _ref3.testId,
        tooltipContent = _ref3.tooltipContent,
        title = _ref3.title,
        Icon = _ref3.icon;
    return (0, _react2.jsx)(DisallowedWrapper, {
      css: disabled ? disallowedWrapperStyle : defaultWrapperStyle,
      key: testId,
      disabled: disabled
    }, (0, _react2.jsx)(_Button.default, {
      css: disabled ? buttonStyleNoneEvent : buttonStyle,
      title: title,
      icon: (0, _react2.jsx)(Icon, {
        size: "medium",
        label: title
      }),
      selected: selected,
      onClick: onClick,
      testId: testId,
      disabled: disabled,
      tooltipContent: tooltipContent
    }));
  }));
};

exports.LinkToolbarButtonGroup = LinkToolbarButtonGroup;