"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeBlockStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _classNames = require("./ui/class-names");

var _styles = require("@atlaskit/editor-common/styles");

var _templateObject;

var codeBlockStyles = function codeBlockStyles(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    ", "\n  }\n\n  .ProseMirror li {\n    /* if same list item has multiple code blocks we need top margin for all but first */\n    > .code-block {\n      margin: ", " 0 0 0;\n    }\n    > .code-block:first-child,\n    > .ProseMirror-gapcursor:first-child + .code-block {\n      margin-top: 0;\n    }\n\n    > div:last-of-type.code-block {\n      margin-bottom: ", ";\n    }\n  }\n\n  .ProseMirror .code-block.", ":not(.danger) {\n    ", "\n  }\n\n  /* Danger when top level node */\n  .ProseMirror .danger.code-block {\n    box-shadow: 0 0 0 ", "px ", ";\n\n    .", " {\n      background-color: ", ";\n      color: ", ";\n    }\n\n    .", " {\n      background-color: ", ";\n    }\n  }\n\n  /* Danger when nested node */\n  .ProseMirror .danger .code-block {\n    .", " {\n      background-color: ", ";\n      color: ", ";\n    }\n\n    .", " {\n      background-color: ", ";\n    }\n  }\n"])), (0, _styles.codeBlockSharedStyles)(props), _editorSharedStyles.blockNodesVerticalMargin, _editorSharedStyles.blockNodesVerticalMargin, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow, _editorSharedStyles.SelectionStyle.Blanket]), _editorSharedStyles.akEditorSelectedBorderSize, _editorSharedStyles.akEditorDeleteBorder, _classNames.codeBlockClassNames.gutter, (0, _tokens.token)('color.blanket.danger', _colors.R75), (0, _tokens.token)('color.text.danger', _editorSharedStyles.akEditorDeleteIconColor), _classNames.codeBlockClassNames.content, (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground), _classNames.codeBlockClassNames.gutter, (0, _tokens.token)('color.blanket.danger', 'rgba(255, 143, 115, 0.5)'), (0, _tokens.token)('color.text.danger', _editorSharedStyles.akEditorDeleteIconColor), _classNames.codeBlockClassNames.content, (0, _tokens.token)('color.background.danger', 'rgba(255, 189, 173, 0.5)'));
};

exports.codeBlockStyles = codeBlockStyles;