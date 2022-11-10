import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import { SelectionStyle, getSelectionStyles, akEditorDeleteBackgroundWithOpacity, akEditorDeleteBorder, akEditorSelectedBorderSize, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var taskDecisionStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  [data-decision-wrapper] {\n    cursor: pointer;\n  }\n\n  .", " > [data-decision-wrapper],\n  ol[data-node-type='decisionList'].", " {\n    border-radius: 4px;\n    ", "\n  }\n\n  .danger {\n    .", ".", "\n      > div {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n      background-color: ", ";\n      &::after {\n        content: none; /* reset the Blanket selection style */\n      }\n    }\n  }\n"])), akEditorSelectedNodeClassName, akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]), TaskDecisionSharedCssClassName.DECISION_CONTAINER, akEditorSelectedNodeClassName, akEditorSelectedBorderSize, token('color.border.danger', akEditorDeleteBorder), token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity));