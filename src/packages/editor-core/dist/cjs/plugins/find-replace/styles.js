"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectedSearchMatchClass = exports.searchMatchClass = exports.findReplaceStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _templateObject;

var searchMatchClass = 'search-match';
exports.searchMatchClass = searchMatchClass;
var selectedSearchMatchClass = 'selected-search-match';
exports.selectedSearchMatchClass = selectedSearchMatchClass;
var findReplaceStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    background-color: ", ";\n  }\n\n  .", " {\n    background-color: ", ";\n    color: white;\n  }\n"])), searchMatchClass, _colors.B75, selectedSearchMatchClass, _colors.B200);
exports.findReplaceStyles = findReplaceStyles;