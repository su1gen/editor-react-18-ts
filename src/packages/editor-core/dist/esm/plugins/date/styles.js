import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { token } from '@atlaskit/tokens';
import { SelectionStyle, getSelectionStyles, akEditorSelectedBorderSize, akEditorDeleteBorder, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
export var dateStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .", " {\n    .", " {\n      line-height: initial;\n      cursor: pointer;\n    }\n\n    &.", " {\n      .", " > span {\n        ", "\n      }\n    }\n  }\n\n  .danger {\n    .", ".", "\n      .", "\n      > span {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n    }\n  }\n"])), DateSharedCssClassName.DATE_CONTAINER, DateSharedCssClassName.DATE_WRAPPER, akEditorSelectedNodeClassName, DateSharedCssClassName.DATE_WRAPPER, getSelectionStyles([SelectionStyle.BoxShadow]), DateSharedCssClassName.DATE_CONTAINER, akEditorSelectedNodeClassName, DateSharedCssClassName.DATE_WRAPPER, akEditorSelectedBorderSize, token('color.border.danger', akEditorDeleteBorder));