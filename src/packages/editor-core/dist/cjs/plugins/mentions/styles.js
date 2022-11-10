"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mentionsStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _mention = require("@atlaskit/editor-common/mention");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var mentionsStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    &.", " [data-mention-id] > span {\n      ", "\n\n      /* need to specify dark text colour because personal mentions\n         (in dark blue) have white text by default */\n      color: ", ";\n    }\n  }\n\n  .danger {\n    .", ".", "\n      > span\n      > span {\n      box-shadow: 0 0 0 ", "px ", ";\n      background-color: ", ";\n    }\n    .", " > span > span {\n      background-color: ", ";\n      color: ", ";\n    }\n  }\n"])), _mention.MentionSharedCssClassName.MENTION_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow, _editorSharedStyles.SelectionStyle.Background]), (0, _tokens.token)('color.text.subtle', _colors.N500), _mention.MentionSharedCssClassName.MENTION_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, _editorSharedStyles.akEditorSelectedBorderSize, _editorSharedStyles.akEditorDeleteBorder, (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackgroundWithOpacity), _mention.MentionSharedCssClassName.MENTION_CONTAINER, (0, _tokens.token)('color.background.neutral', _colors.N30A), (0, _tokens.token)('color.text.subtle', _colors.N500));
exports.mentionsStyles = mentionsStyles;