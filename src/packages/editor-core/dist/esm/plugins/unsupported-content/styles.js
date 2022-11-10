import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { SelectionStyle, getSelectionStyles, akEditorDeleteBackgroundWithOpacity, akEditorSelectedBorderSize, akEditorDeleteBorder, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var UnsupportedSharedCssClassName = {
  BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
  INLINE_CONTAINER: 'unsupportedInlineView-content-wrap'
};
var inlineUnsupportedSelector = ".".concat(UnsupportedSharedCssClassName.INLINE_CONTAINER, " > span:nth-of-type(2)");
var blockUnsupportedSelector = ".".concat(UnsupportedSharedCssClassName.BLOCK_CONTAINER, " > div");
export var unsupportedStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", ", ", " {\n    cursor: pointer;\n  }\n\n  .", "", ",\n    .", "", " {\n    ", "\n  }\n\n  .danger {\n    .", "", ",\n      .", "", " {\n      border: ", "px solid\n        ", ";\n      background-color: ", ";\n    }\n  }\n"])), blockUnsupportedSelector, inlineUnsupportedSelector, akEditorSelectedNodeClassName, blockUnsupportedSelector, akEditorSelectedNodeClassName, inlineUnsupportedSelector, getSelectionStyles([SelectionStyle.Background, SelectionStyle.Border]), akEditorSelectedNodeClassName, blockUnsupportedSelector, akEditorSelectedNodeClassName, inlineUnsupportedSelector, akEditorSelectedBorderSize, token('color.border.danger', akEditorDeleteBorder), token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity));