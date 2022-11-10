import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var container = function container(height) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  padding: 4px 8px;\n  background-color: ", ";\n  ", ";\n"])), borderRadius(), token('elevation.shadow.overlay', "0 12px 24px -6px ".concat(N50A, ", 0 0 1px ").concat(N60A)), token('color.background.input', N0), height ? css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        height: ", "px;\n      "])), height) : '');
};