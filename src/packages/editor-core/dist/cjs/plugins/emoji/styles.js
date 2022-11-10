"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emojiStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _emoji = require("@atlaskit/editor-common/emoji");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject;

var emojiStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    display: inline-block;\n\n    .", " {\n      cursor: pointer;\n\n      &.", " > span {\n        /** needed for selection style to cover custom emoji image properly */\n        display: flex;\n      }\n    }\n\n    &.", " {\n      .", ",\n        .", " {\n        border-radius: 2px;\n        ", "\n      }\n    }\n  }\n"])), _emoji.EmojiSharedCssClassName.EMOJI_CONTAINER, _emoji.EmojiSharedCssClassName.EMOJI_NODE, _emoji.EmojiSharedCssClassName.EMOJI_IMAGE, _editorSharedStyles.akEditorSelectedNodeClassName, _emoji.EmojiSharedCssClassName.EMOJI_SPRITE, _emoji.EmojiSharedCssClassName.EMOJI_IMAGE, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.Blanket, _editorSharedStyles.SelectionStyle.BoxShadow]));
exports.emojiStyles = emojiStyles;