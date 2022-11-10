import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { R75 } from '@atlaskit/theme/colors';
import { akEditorDeleteBackground, akEditorDeleteBorder, akEditorSelectedBorderSize, akEditorDeleteIconColor, SelectionStyle, getSelectionStyles, akEditorSelectedNodeClassName, blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { codeBlockClassNames } from './ui/class-names';
import { codeBlockSharedStyles } from '@atlaskit/editor-common/styles';
export var codeBlockStyles = function codeBlockStyles(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    ", "\n  }\n\n  .ProseMirror li {\n    /* if same list item has multiple code blocks we need top margin for all but first */\n    > .code-block {\n      margin: ", " 0 0 0;\n    }\n    > .code-block:first-child,\n    > .ProseMirror-gapcursor:first-child + .code-block {\n      margin-top: 0;\n    }\n\n    > div:last-of-type.code-block {\n      margin-bottom: ", ";\n    }\n  }\n\n  .ProseMirror .code-block.", ":not(.danger) {\n    ", "\n  }\n\n  /* Danger when top level node */\n  .ProseMirror .danger.code-block {\n    box-shadow: 0 0 0 ", "px ", ";\n\n    .", " {\n      background-color: ", ";\n      color: ", ";\n    }\n\n    .", " {\n      background-color: ", ";\n    }\n  }\n\n  /* Danger when nested node */\n  .ProseMirror .danger .code-block {\n    .", " {\n      background-color: ", ";\n      color: ", ";\n    }\n\n    .", " {\n      background-color: ", ";\n    }\n  }\n"])), codeBlockSharedStyles(props), blockNodesVerticalMargin, blockNodesVerticalMargin, akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]), akEditorSelectedBorderSize, akEditorDeleteBorder, codeBlockClassNames.gutter, token('color.blanket.danger', R75), token('color.text.danger', akEditorDeleteIconColor), codeBlockClassNames.content, token('color.background.danger', akEditorDeleteBackground), codeBlockClassNames.gutter, token('color.blanket.danger', 'rgba(255, 143, 115, 0.5)'), token('color.text.danger', akEditorDeleteIconColor), codeBlockClassNames.content, token('color.background.danger', 'rgba(255, 189, 173, 0.5)'));
};