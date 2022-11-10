import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import { SelectionStyle, getSelectionStyles, akEditorSelectedBorderSize, akEditorDeleteBorder, akEditorDeleteBackgroundWithOpacity, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { N500, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var mentionsStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .", " {\n    &.", " [data-mention-id] > span {\n      ", "\n\n      /* need to specify dark text colour because personal mentions\n         (in dark blue) have white text by default */\n      color: ", ";\n    }\n  }\n\n  .danger {\n    .", ".", "\n      > span\n      > span {\n      box-shadow: 0 0 0 ", "px ", ";\n      background-color: ", ";\n    }\n    .", " > span > span {\n      background-color: ", ";\n      color: ", ";\n    }\n  }\n"])), MentionSharedCssClassName.MENTION_CONTAINER, akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Background]), token('color.text.subtle', N500), MentionSharedCssClassName.MENTION_CONTAINER, akEditorSelectedNodeClassName, akEditorSelectedBorderSize, akEditorDeleteBorder, token('color.background.danger', akEditorDeleteBackgroundWithOpacity), MentionSharedCssClassName.MENTION_CONTAINER, token('color.background.neutral', N30A), token('color.text.subtle', N500));