"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.title = exports.row = exports.line = exports.header = exports.footer = exports.dialogHeader = exports.contentWrapper = exports.content = exports.column = exports.codeSm = exports.codeMd = exports.codeLg = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var colors = _interopRequireWildcard(require("@atlaskit/theme/colors"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var header = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  z-index: ", ";\n  min-height: 24px;\n  padding: 20px 40px;\n  font-size: ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-shadow: 'none';\n  color: ", ";\n  background-color: ", ";\n  border-radius: ", "px;\n"])), _editorSharedStyles.akEditorUnitZIndex, (0, _editorSharedStyles.relativeFontSizeToBase16)(24), (0, _tokens.token)('color.text', colors.N400), (0, _tokens.token)('color.background.neutral.subtle', colors.N0), (0, _constants.borderRadius)());
exports.header = header;
var footer = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  z-index: ", ";\n  font-size: ", ";\n  line-height: 20px;\n  color: ", ";\n  padding: 24px;\n  text-align: right;\n  box-shadow: 'none';\n"])), _editorSharedStyles.akEditorUnitZIndex, (0, _editorSharedStyles.relativeFontSizeToBase16)(14), (0, _tokens.token)('color.text.subtlest', colors.N300));
exports.footer = footer;
var contentWrapper = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 20px 44px;\n  border-bottom-right-radius: ", "px;\n  overflow: auto;\n  position: relative;\n  color: ", ";\n  background-color: ", ";\n"])), (0, _constants.borderRadius)(), (0, _tokens.token)('color.text.subtle', colors.N400), (0, _tokens.token)('color.background.neutral.subtle', colors.N0));
exports.contentWrapper = contentWrapper;
var line = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  min-width: 604px;\n"])), (0, _tokens.token)('color.background.neutral.subtle', '#fff'));
exports.line = line;
var content = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  min-width: 524px;\n  width: 100%;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n"])));
exports.content = content;
var column = {
  width: '44%',
  '& > ul': {
    padding: 0
  }
};
exports.column = column;
var row = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 20px 0;\n  display: flex;\n  justify-content: space-between;\n"])));
exports.row = row;
var dialogHeader = {
  '&': {
    fontSize: (0, _editorSharedStyles.relativeFontSizeToBase16)(24),
    fontWeight: 400,
    color: (0, _tokens.token)('color.text.subtle', colors.N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143
  }
};
exports.dialogHeader = dialogHeader;
var title = {
  '&': {
    fontSize: (0, _editorSharedStyles.relativeFontSizeToBase16)(18),
    fontWeight: 400,
    color: (0, _tokens.token)('color.text.subtle', colors.N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143
  }
};
exports.title = title;
var codeSm = (0, _react.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  border-radius: ", "px;\n  width: 24px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  text-align: center;\n"])), (0, _tokens.token)('color.background.neutral', colors.N20), (0, _constants.borderRadius)());
exports.codeSm = codeSm;
var codeMd = (0, _react.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  border-radius: ", "px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  width: 50px;\n  text-align: center;\n"])), (0, _tokens.token)('color.background.neutral', colors.N20), (0, _constants.borderRadius)());
exports.codeMd = codeMd;
var codeLg = (0, _react.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  border-radius: ", "px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  padding: 0 10px;\n  text-align: center;\n"])), (0, _tokens.token)('color.background.neutral', colors.N20), (0, _constants.borderRadius)());
exports.codeLg = codeLg;