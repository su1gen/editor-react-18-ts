"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapperStyles = exports.sectionWrapperStyles = exports.ruleStyles = exports.replaceSectionButtonStyles = exports.countStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject;

var replaceSectionButtonStyles = (0, _react.css)({
  marginLeft: '4px'
});
exports.replaceSectionButtonStyles = replaceSectionButtonStyles;
var ruleStyles = (0, _react.css)({
  width: '100%',
  border: 'none',
  backgroundColor: "".concat((0, _tokens.token)('color.border', _colors.N30A)),
  margin: '4px 0px',
  height: '1px',
  borderRadius: '1px'
});
exports.ruleStyles = ruleStyles;
var wrapperStyles = (0, _react.css)({
  display: 'flex',
  flexDirection: 'column',
  '> *:not(#replace-hr-element)': {
    margin: '0px 4px'
  }
});
exports.wrapperStyles = wrapperStyles;
var sectionWrapperStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n\n  & > * {\n    display: inline-flex;\n    height: 32px;\n    flex: 0 0 auto;\n  }\n\n  & > [data-ds--text-field--container] {\n    display: flex;\n    flex: 1 1 auto;\n  }\n"])));
exports.sectionWrapperStyles = sectionWrapperStyles;
var countStyles = (0, _react.css)({
  color: "".concat((0, _tokens.token)('color.text.subtlest', _colors.N60)),
  fontSize: "".concat((0, _editorSharedStyles.relativeFontSizeToBase16)(12)),
  flex: '0 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '4px',
  marginRight: '8px'
});
exports.countStyles = countStyles;