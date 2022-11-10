import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { wrapperDefault } from '../styles';
import { token } from '@atlaskit/tokens';
export var wrapperStyle = function wrapperStyle(theme) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n\n  cursor: pointer;\n  display: inline-flex;\n  margin: 1px 1px 4px;\n\n  > img {\n    border-radius: ", "px;\n  }\n\n  &::after,\n  &::before {\n    vertical-align: text-top;\n    display: inline-block;\n    width: 1px;\n    content: '';\n  }\n\n  &.with-children {\n    padding: 0;\n    background: ", ";\n  }\n"])), wrapperDefault(theme), borderRadius(), token('color.background.neutral.subtle', 'white'));
};