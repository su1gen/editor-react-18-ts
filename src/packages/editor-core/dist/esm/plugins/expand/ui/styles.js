import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { R50, R300, N40A, N50A, N80A, DN50, R200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { sharedExpandStyles } from '@atlaskit/editor-common/ui';
import { SelectionStyle, getSelectionStyles, akLayoutGutterOffset, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { BreakoutCssClassName } from '../../breakout/constants';
import { expandClassNames } from './class-names';
var EXPAND_SELECTED_BACKGROUND = themed({
  light: token('color.background.neutral.subtle', 'rgba(255, 255, 255, 0.6)'),
  dark: token('color.background.neutral.subtle', 'rgba(9, 10, 11, 0.29)')
});

var EXPAND_ICON_COLOR = function EXPAND_ICON_COLOR(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n"])), themed({
    light: token('color.icon.subtle', N80A),
    dark: token('color.icon.subtle', '#d9dde3')
  })(props));
};

var ACTIVE_STATE_BACKGROUND_COLOR = themed({
  dark: token('color.blanket.selected', "#0C294F4B")
});
var ACTIVE_STATE_BORDER = themed({
  dark: "1px solid ".concat(token('color.border.selected', "#4794ff4B"))
});
var ACTIVE_STATE_BORDER_RADIUS = themed({
  dark: '3px'
});
var DANGER_STATE_BACKGROUND_COLOR = themed({
  light: token('color.background.danger', R50),
  dark: token('color.background.danger', '#441C13')
});
var DANGER_STATE_BORDER = themed({
  dark: "1px solid ".concat(token('color.border.danger', R200))
});
var DANGER_STATE_BORDER_COLOR = themed({
  light: token('color.border.danger', R300)
});
var DANGER_STATE_BORDER_RADIUS = themed({
  dark: '3px'
});
export var expandStyles = function expandStyles(props) {
  return css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  .", " > div {\n    display: flex;\n  }\n\n  .", " {\n    ", "\n    overflow: hidden;\n    cursor: pointer;\n    box-sizing: border-box;\n\n    td > & {\n      margin-top: 0;\n    }\n\n    .", " svg {\n      ", ";\n      transform: rotate(90deg);\n    }\n\n    &.", ":not(.danger) {\n      ", "\n\n      ::after {\n        // Custom background color and borders (for dark theme).\n        background-color: ", ";\n        border: ", ";\n        border-radius: ", ";\n      }\n    }\n\n    &.danger {\n      background: ", ";\n      border: ", ";\n      border-color: ", ";\n      border-radius: ", ";\n    }\n  }\n\n  .ProseMirror\n    > .", ",\n    .", "\n    > .", " {\n    margin-left: -", "px;\n    margin-right: -", "px;\n  }\n\n  .", " {\n    ", "\n    cursor: text;\n    padding-top: 0px;\n  }\n\n  .", " {\n    ", "\n  }\n\n  .", " {\n    ", ";\n    align-items: center;\n    overflow: visible;\n  }\n\n  .", " {\n    background: ", ";\n    border-color: ", ";\n\n    .", " {\n      padding-top: ", "px;\n    }\n  }\n\n  .", " {\n    width: 100%;\n  }\n\n  /* stylelint-disable property-no-unknown, value-keyword-case */\n  .", ":(.", ") {\n    .expand-content-wrapper {\n      height: auto;\n    }\n  }\n  /* stylelint-enable property-no-unknown, value-keyword-case */\n\n  .", ":not(.", ") {\n    .ak-editor-expand__content {\n      position: absolute;\n      height: 1px;\n      width: 1px;\n      overflow: hidden;\n      clip: rect(1px, 1px, 1px, 1px);\n      white-space: nowrap;\n    }\n\n    .", " svg {\n      ", ";\n      transform: rotate(0deg);\n    }\n\n    &:not(.", "):not(.danger) {\n      background: transparent;\n      border-color: transparent;\n\n      &:hover {\n        border-color: ", ";\n        background: ", ";\n      }\n    }\n  }\n"])), expandClassNames.icon, expandClassNames.prefix, sharedExpandStyles.containerStyles({
    expanded: false,
    focused: false
  })(props), expandClassNames.iconContainer, EXPAND_ICON_COLOR(props), akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border]), ACTIVE_STATE_BACKGROUND_COLOR(props), ACTIVE_STATE_BORDER(props), ACTIVE_STATE_BORDER_RADIUS(props), DANGER_STATE_BACKGROUND_COLOR(props), DANGER_STATE_BORDER(props), DANGER_STATE_BORDER_COLOR(props), DANGER_STATE_BORDER_RADIUS(props), expandClassNames.type('expand'), BreakoutCssClassName.BREAKOUT_MARK_DOM, expandClassNames.type('expand'), akLayoutGutterOffset, akLayoutGutterOffset, expandClassNames.content, sharedExpandStyles.contentStyles({
    expanded: false,
    focused: false
  })(props), expandClassNames.titleInput, sharedExpandStyles.titleInputStyles(props), expandClassNames.titleContainer, sharedExpandStyles.titleContainerStyles(props), expandClassNames.expanded, EXPAND_SELECTED_BACKGROUND(props), themed({
    light: token('color.border', N40A),
    dark: token('color.border', DN50)
  })(props), expandClassNames.content, gridSize(), expandClassNames.inputContainer, expandClassNames.prefix, expandClassNames.expanded, expandClassNames.prefix, expandClassNames.expanded, expandClassNames.iconContainer, EXPAND_ICON_COLOR(props), akEditorSelectedNodeClassName, themed({
    light: token('color.border', N50A),
    dark: token('color.border', DN50)
  })(props), EXPAND_SELECTED_BACKGROUND(props));
};