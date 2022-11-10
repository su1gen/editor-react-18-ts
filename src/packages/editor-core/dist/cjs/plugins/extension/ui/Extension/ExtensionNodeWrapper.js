"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = require("@atlaskit/editor-common/utils");

var ExtensionNodeWrapper = function ExtensionNodeWrapper(_ref) {
  var children = _ref.children,
      nodeType = _ref.nodeType;
  return /*#__PURE__*/_react.default.createElement("span", null, children, nodeType === 'inlineExtension' && _utils.ZERO_WIDTH_SPACE);
};

var _default = ExtensionNodeWrapper;
exports.default = _default;