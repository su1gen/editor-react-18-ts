import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { N300 } from '@atlaskit/theme/colors';
import { SelectionStyle, getSelectionStyles, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var placeholderTextStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror span[data-placeholder] {\n    color: ", ";\n    display: inline;\n  }\n\n  .ProseMirror span.pm-placeholder {\n    display: inline;\n    color: ", ";\n  }\n  .ProseMirror span.pm-placeholder__text {\n    display: inline;\n    color: ", ";\n  }\n\n  .ProseMirror span.pm-placeholder.", " {\n    ", "\n  }\n\n  .ProseMirror span.pm-placeholder__text[data-placeholder]::after {\n    color: ", ";\n    cursor: text;\n    content: attr(data-placeholder);\n    display: inline;\n  }\n"])), token('color.text.subtlest', N300), token('color.text.subtlest', N300), token('color.text.subtlest', N300), akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.Background]), token('color.text.subtlest', N300));