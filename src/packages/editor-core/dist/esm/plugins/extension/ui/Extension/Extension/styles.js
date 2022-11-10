import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

import { css } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { DN30, DN900, N30 } from '@atlaskit/theme/colors';
import { wrapperDefault, padding } from '../styles';
import { token } from '@atlaskit/tokens';
export var widerLayoutClassName = 'wider-layout';
export var wrapperStyle = function wrapperStyle(theme) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n\n  &.without-frame {\n    background: transparent;\n  }\n  cursor: pointer;\n  width: 100%;\n\n  .extension-overflow-wrapper:not(.with-body) {\n    overflow-x: auto;\n  }\n"])), wrapperDefault(theme));
};
export var header = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  padding: ", "px ", "px 0px;\n  vertical-align: middle;\n\n  &.with-children:not(.without-frame) {\n    padding: 4px 8px 8px;\n  }\n  &.without-frame {\n    padding: 0;\n  }\n"])), padding / 2, padding / 2);
export var content = function content(theme) {
  return css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding: ", "px;\n  background: ", ";\n  color: ", ";\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  cursor: initial;\n"])), padding, themed({
    light: token('elevation.surface', 'white'),
    dark: token('elevation.surface', DN30)
  })(theme), themed({
    dark: token('color.text', DN900)
  })(theme), token('color.border', N30), borderRadius());
};
export var contentWrapper = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  padding: 0 ", "px ", "px;\n"])), padding, padding);