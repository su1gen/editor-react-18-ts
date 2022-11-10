import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { N800, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var dropdownItem = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  text-decoration: none;\n  padding: 8px 32px 8px 12px;\n  color: ", ";\n  > span {\n    display: flex;\n    margin-right: 8px;\n  }\n  &:hover {\n    background-color: ", ";\n  }\n"])), token('color.text', N800), token('color.background.neutral.subtle.hovered', N20));