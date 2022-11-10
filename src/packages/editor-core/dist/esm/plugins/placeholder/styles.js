import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var placeHolderClassName = 'placeholder-decoration';
export var placeholderStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror .", " {\n    position: relative;\n    color: ", ";\n    width: 100%;\n\n    pointer-events: none;\n    display: block;\n    user-select: none;\n\n    > span {\n      position: absolute;\n      pointer-events: none;\n      outline: none;\n    }\n\n    &.align-end > span {\n      right: 0;\n    }\n\n    &.align-center > span {\n      left: 0;\n    }\n  }\n"])), placeHolderClassName, token('color.text.subtlest', N200));