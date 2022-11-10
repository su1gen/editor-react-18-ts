import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import { css } from '@emotion/react';
import { N400 } from '@atlaskit/theme/colors';
import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '../../../../ui/styles';
import { token } from '@atlaskit/tokens';
export var blockTypeMenuItemStyle = function blockTypeMenuItemStyle(tagName, selected) {
  // TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
  var selectedStyle = selected ? "".concat(tagName, " { color: ").concat(token('color.text', 'white'), " !important; }") : '';
  return function (themeProps) {
    return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    ", ";\n    > {\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        margin-top: 0;\n      }\n    }\n    ", ";\n  "])), headingsSharedStyles(themeProps), selectedStyle);
  };
};
export var keyboardShortcut = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ", "\n  margin-left: 16px;\n"])), shortcutStyle);
export var keyboardShortcutSelect = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  color: ", ";\n"])), token('color.icon', N400));