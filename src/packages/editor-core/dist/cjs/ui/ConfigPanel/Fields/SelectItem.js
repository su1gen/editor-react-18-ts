"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatOptionLabel = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _avatar = _interopRequireDefault(require("@atlaskit/avatar"));

var _constants = require("@atlaskit/theme/constants");

var _templateObject, _templateObject2, _templateObject3;

var itemWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n\n  small {\n    margin: 0;\n    display: block;\n    color: currentColor;\n  }\n"])));
var iconWrapper = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  line-height: 1;\n"])));
var iconWrapperMenu = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  align-self: flex-start;\n  margin-top: 3px;\n"])));

var getIconSize = function getIconSize(context, description) {
  if (context === 'value' || !description) {
    return 'xsmall';
  }

  return 'small';
};

var formatOptionLabel = function formatOptionLabel(_ref, _ref2) {
  var label = _ref.label,
      icon = _ref.icon,
      description = _ref.description;
  var context = _ref2.context;
  return (0, _react.jsx)("div", {
    css: itemWrapper
  }, (0, _react.jsx)("span", {
    css: [iconWrapper, context === 'menu' && iconWrapperMenu]
  }, typeof icon === 'string' ? (0, _react.jsx)(_avatar.default, {
    src: icon,
    size: getIconSize(context, description),
    appearance: "square"
  }) : icon), (0, _react.jsx)("div", {
    style: {
      paddingLeft: icon ? (0, _constants.gridSize)() : 0
    }
  }, (0, _react.jsx)("p", null, label, description && context !== 'value' && (0, _react.jsx)("small", null, description))));
};

exports.formatOptionLabel = formatOptionLabel;