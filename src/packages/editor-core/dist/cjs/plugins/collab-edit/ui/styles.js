"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteTeamWrapper = exports.badge = exports.avatarContainer = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3;

var inviteTeamWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  border-radius: 50%;\n  min-width: ", "px;\n  margin-left: -", "px;\n"])), (0, _tokens.token)('color.background.neutral', _colors.N20), (0, _constants.gridSize)() * 4, (0, _constants.gridSize)() / 2);
exports.inviteTeamWrapper = inviteTeamWrapper;
var avatarContainer = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin-right: ", "px;\n  display: flex;\n  align-items: center;\n\n  // ED-13102: This is to override list styles that come from the\n  // .wiki-content class in Confluence that should not apply within\n  // the toolbar. Has to be extra specific to override.\n  && > ul {\n    list-style-type: none;\n  }\n\n  div:last-child button.invite-to-edit {\n    border-radius: 50%;\n    height: 32px;\n    width: 32px;\n    padding: 2px;\n  }\n"])), (0, _constants.gridSize)());
exports.avatarContainer = avatarContainer;

var badge = function badge(color) {
  return (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: block;\n  position: absolute;\n  right: 1px;\n  bottom: 1px;\n  width: 13px;\n  height: 13px;\n  z-index: ", ";\n  border-radius: 3px;\n  background: ", ";\n  color: ", ";\n  font-size: ", ";\n  line-height: 0;\n  padding-top: 7px;\n  text-align: center;\n  box-shadow: 0 0 1px ", ";\n  box-sizing: border-box;\n"])), _editorSharedStyles.akEditorSmallZIndex, color, (0, _tokens.token)('color.text.inverse', '#fff'), (0, _editorSharedStyles.relativeFontSizeToBase16)(9), (0, _tokens.token)('color.border.inverse', '#fff'));
};

exports.badge = badge;