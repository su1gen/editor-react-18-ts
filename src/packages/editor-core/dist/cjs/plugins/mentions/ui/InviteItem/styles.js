"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rowStyle = exports.nameSectionStyle = exports.mentionItemStyle = exports.mentionItemSelectedStyle = exports.capitalizedStyle = exports.avatarStyle = exports.ROW_SIDE_PADDING = exports.AVATAR_HEIGHT = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

var ROW_SIDE_PADDING = 14;
exports.ROW_SIDE_PADDING = ROW_SIDE_PADDING;
var rowStyle = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  overflow: hidden;\n  padding: 6px ", "px;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n"])), ROW_SIDE_PADDING);
exports.rowStyle = rowStyle;
var AVATAR_HEIGHT = 36;
exports.AVATAR_HEIGHT = AVATAR_HEIGHT;
var avatarStyle = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  flex: initial;\n  opacity: inherit;\n  width: 36px;\n  height: ", "px;\n\n  > span {\n    width: 24px;\n    height: 24px;\n    padding: 6px;\n  }\n"])), AVATAR_HEIGHT);
exports.avatarStyle = avatarStyle;
var nameSectionStyle = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 1;\n  min-width: 0;\n  margin-left: 14px;\n  color: ", ";\n  opacity: inherit;\n"])), (0, _tokens.token)('color.text.subtle', _colors.N300));
exports.nameSectionStyle = nameSectionStyle;
var mentionItemStyle = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: transparent;\n  display: block;\n  overflow: hidden;\n  list-style-type: none;\n  cursor: pointer;\n"])));
exports.mentionItemStyle = mentionItemStyle;
var mentionItemSelectedStyle = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n"])), (0, _tokens.token)('color.background.neutral.subtle.hovered', _colors.N30));
exports.mentionItemSelectedStyle = mentionItemSelectedStyle;
var capitalizedStyle = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  text-transform: capitalize;\n"])));
exports.capitalizedStyle = capitalizedStyle;