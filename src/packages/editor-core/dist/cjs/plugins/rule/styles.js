"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var ruleStyles = function ruleStyles(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    ", ";\n\n    hr {\n      cursor: pointer;\n      padding: 4px 0;\n      margin: calc(", "em - 4px) 0;\n      background-clip: content-box;\n\n      &.", " {\n        outline: none;\n        background-color: ", ";\n      }\n    }\n  }\n"])), (0, _styles.ruleSharedStyles)(props), _editorSharedStyles.akEditorLineHeight, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _tokens.token)('color.border.selected', _editorSharedStyles.akEditorSelectedBorderColor));
};

exports.ruleStyles = ruleStyles;