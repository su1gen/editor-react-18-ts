import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css } from '@emotion/react';
import { N400, N100 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens'; // Normal .className gets overridden by input[type=text] hence this hack to produce input.className

export var panelTextInput = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  input& {\n    background: transparent;\n    border: 0;\n    border-radius: 0;\n    box-sizing: content-box;\n    color: ", ";\n    flex-grow: 1;\n    font-size: ", ";\n    line-height: 20px;\n    padding: 0;\n    min-width: 145px;\n\n    /* Hides IE10+ built-in [x] clear input button */\n    &::-ms-clear {\n      display: none;\n    }\n\n    &:focus {\n      outline: none;\n    }\n\n    &::placeholder {\n      color: ", ";\n    }\n  }\n"])), token('color.text.subtle', N400), relativeFontSizeToBase16(13), token('color.text.subtlest', N100));
export var panelTextInputWithCustomWidth = function panelTextInputWithCustomWidth(width) {
  return css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  input& {\n    width: ", "px;\n  }\n"])), width);
};