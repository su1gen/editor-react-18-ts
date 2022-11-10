import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { blockNodesVerticalMargin, akEditorSelectedBorderSize, akEditorDeleteBorder, akEditorDeleteBackground, SelectionStyle, getSelectionStyles, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var extensionStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .extensionView-content-wrap,\n  .bodiedExtensionView-content-wrap {\n    margin: ", " 0;\n\n    &:first-of-type {\n      margin-top: 0;\n    }\n\n    &:last-of-type {\n      margin-bottom: 0;\n    }\n\n    &:not(.danger).", " {\n      & > span > .extension-container {\n        ", "\n      }\n    }\n\n    &.danger > span > .extension-container {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n      background-color: ", ";\n    }\n\n    &.inline {\n      word-wrap: break-all;\n    }\n  }\n\n  .extensionView-content-wrap .extension-container {\n    overflow: hidden;\n  }\n\n  .bodiedExtensionView-content-wrap\n    .extensionView-content-wrap\n    .extension-container {\n    width: 100%;\n    max-width: 100%; // ensure width can't go over 100%;\n  }\n"])), blockNodesVerticalMargin, akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.BoxShadow]), akEditorSelectedBorderSize, token('color.border.danger', akEditorDeleteBorder), token('color.background.danger', akEditorDeleteBackground));