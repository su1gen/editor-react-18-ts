import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { akEditorSubtleAccent, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { borderRadius } from '@atlaskit/theme/constants';
import { N300, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var inputStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  /* Normal .className gets overridden by input[type=text] hence this hack to produce input.className */\n  input& {\n    background-color: ", ";\n    border: 1px solid ", ";\n    border-radius: ", "px;\n    box-sizing: border-box;\n    height: 40px;\n    padding-left: 20px;\n    padding-top: 12px;\n    padding-bottom: 12px;\n    font-size: ", ";\n    width: 100%;\n    font-weight: 400;\n    line-height: 1.42857142857143;\n    letter-spacing: -0.005em;\n    color: ", ";\n\n    &:hover {\n      background-color: ", ";\n      border-color: ", ";\n      cursor: text;\n    }\n  }\n"])), token('color.background.input', 'white'), token('color.border.input', akEditorSubtleAccent), borderRadius(), relativeFontSizeToBase16(14), token('color.text.subtlest', N300), token('color.background.input.hovered', 'white'), token('color.border.input', N50));