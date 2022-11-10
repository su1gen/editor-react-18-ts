import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { ruleSharedStyles } from '@atlaskit/editor-common/styles';
import { akEditorLineHeight, akEditorSelectedBorderColor, akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var ruleStyles = function ruleStyles(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    ", ";\n\n    hr {\n      cursor: pointer;\n      padding: 4px 0;\n      margin: calc(", "em - 4px) 0;\n      background-clip: content-box;\n\n      &.", " {\n        outline: none;\n        background-color: ", ";\n      }\n    }\n  }\n"])), ruleSharedStyles(props), akEditorLineHeight, akEditorSelectedNodeClassName, token('color.border.selected', akEditorSelectedBorderColor));
};