"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandControl = exports.expandContainer = exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _chevronRight = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right"));

var _button = _interopRequireDefault(require("@atlaskit/button"));

var _constants = require("@atlaskit/theme/constants");

var _messages = require("../messages");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var expandContainer = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  border-bottom: 1px solid ", ";\n"])), (0, _tokens.token)('color.border', _colors.N40));
exports.expandContainer = expandContainer;
var expandControl = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  height: ", "px;\n  justify-content: center;\n  padding-right: ", "px;\n"])), (0, _constants.gridSize)() * 6, (0, _constants.gridSize)());
exports.expandControl = expandControl;
var chevronContainer = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n\n  & > button {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), (0, _constants.gridSize)() * 3, (0, _constants.gridSize)() * 3);
var labelContainer = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  width: 100%;\n  align-items: center;\n  display: flex;\n  font-weight: 500;\n"])));

var expandContentContainer = function expandContentContainer(isHidden) {
  return (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  display: ", ";\n  margin-top: -", "px;\n"])), isHidden ? 'none' : 'block', (0, _constants.gridSize)());
};

function Expand(_ref) {
  var field = _ref.field,
      children = _ref.children,
      _ref$isExpanded = _ref.isExpanded,
      isExpanded = _ref$isExpanded === void 0 ? false : _ref$isExpanded,
      intl = _ref.intl;

  var _useState = (0, _react.useState)(isExpanded),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  return (0, _react2.jsx)("div", {
    css: expandContainer
  }, (0, _react2.jsx)("div", {
    css: expandControl
  }, (0, _react2.jsx)("div", {
    css: labelContainer
  }, field.label), (0, _react2.jsx)("div", {
    css: chevronContainer
  }, (0, _react2.jsx)(_button.default, {
    onClick: function onClick() {
      setExpanded(!expanded);
    },
    testId: "form-expand-toggle",
    iconBefore: expanded ? (0, _react2.jsx)(_chevronDown.default, {
      label: intl.formatMessage(_messages.messages.collapse)
    }) : (0, _react2.jsx)(_chevronRight.default, {
      label: intl.formatMessage(_messages.messages.expand)
    })
  }))), (0, _react2.jsx)("div", {
    "data-testid": "expand-content-container",
    css: expandContentContainer(!expanded)
  }, children));
}

var _default = (0, _reactIntlNext.injectIntl)(Expand);

exports.default = _default;