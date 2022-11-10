import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { messages } from './messages';
var placeholder = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n  width: 100%;\n  text-align: center;\n  margin-top: 8px !important;\n  display: block;\n"])), token('color.text.subtlest', N200));
export var CAPTION_PLACEHOLDER_ID = 'caption-placeholder';
export default (function (_ref) {
  var onClick = _ref.onClick;
  return jsx("span", {
    css: placeholder,
    onClick: onClick,
    "data-id": CAPTION_PLACEHOLDER_ID,
    "data-testid": "caption-placeholder"
  }, jsx(FormattedMessage, messages.placeholder));
});