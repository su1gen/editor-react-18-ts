import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { panelSharedStyles, PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { SelectionStyle, getSelectionStyles, akEditorDeleteBackground, akEditorDeleteBackgroundWithOpacity, akEditorDeleteBorder, akEditorSelectedBorderSize, akEditorDeleteIconColor, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var panelStyles = function panelStyles(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    .", " {\n      cursor: pointer;\n\n      /* Danger when top level node */\n      &.danger {\n        box-shadow: 0 0 0 ", "px\n          ", ";\n        background-color: ", " !important;\n\n        .", " {\n          color: ", " !important;\n        }\n      }\n    }\n\n    .", " {\n      cursor: text;\n    }\n\n    /* Danger when nested node */\n    .danger .", " {\n      &[data-panel-type] {\n        background-color: ", ";\n\n        .", " {\n          color: ", ";\n        }\n      }\n    }\n\n    ", ";\n  }\n\n  .", ".", ":not(.danger) {\n    ", "\n  }\n"])), PanelSharedCssClassName.prefix, akEditorSelectedBorderSize, akEditorDeleteBorder, token('color.background.danger', akEditorDeleteBackground), PanelSharedCssClassName.icon, token('color.icon.danger', akEditorDeleteIconColor), PanelSharedCssClassName.content, PanelSharedCssClassName.prefix, token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity), PanelSharedCssClassName.icon, token('color.icon.danger', akEditorDeleteIconColor), panelSharedStyles(props), PanelSharedCssClassName.prefix, akEditorSelectedNodeClassName, getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]));
};