import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var dropdown = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  box-sizing: border-box;\n  padding: 4px 0;\n"])), token('elevation.surface.overlay', 'white'), borderRadius(), token('elevation.shadow.overlay', "0 4px 8px -2px ".concat(N60A, ", 0 0 1px ").concat(N60A)));