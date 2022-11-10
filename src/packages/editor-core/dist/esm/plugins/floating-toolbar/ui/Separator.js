import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
var separator = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: ", ";\n  width: 1px;\n  height: 20px;\n  margin: 0 4px;\n  align-self: center;\n"])), token('color.border', N30));
export default (function () {
  return jsx("div", {
    css: separator,
    className: "separator"
  });
});