import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;

import { css } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
export { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar'; // TODO ED-15449 delete this style when deleting editor-core table

export var cellColourPreviewStyles = function cellColourPreviewStyles(selectedColor) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  &::before {\n    background: ", ";\n  }\n"])), selectedColor);
};
export var buttonGroupStyle = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: inline-flex;\n  align-items: center;\n\n  & > div {\n    display: flex;\n  }\n"])));
export var separatorStyles = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  background: ", ";\n  width: 1px;\n  height: 24px;\n  display: inline-block;\n  margin: 0 8px;\n"])), token('color.border', N30));
export var wrapperStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n\n  > div,\n  > span {\n    display: flex;\n  }\n\n  > div > div {\n    display: flex;\n  }\n\n  margin-left: 0;\n  min-width: auto;\n"])));
export var wrapperSmallStyle = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  margin-left: 4px;\n  min-width: 40px;\n"])));
export var expandIconWrapperStyle = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  margin-left: -8px;\n"])));
export var triggerWrapperStyles = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  display: flex;\n"])));
export var buttonContentStyle = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  display: flex;\n  min-width: 80px;\n  align-items: center;\n  overflow: hidden;\n  justify-content: center;\n  flex-direction: column;\n  padding: 6px;\n"])));
export var buttonContentReducedSpacingStyle = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  padding: 8px;\n"]))); // Taken from the style of inline dialog components

export var dropShadow = css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  box-shadow: ", ";\n"])), token('elevation.shadow.overlay', "0 0 1px rgba(9, 30, 66, 0.31),\n    0 4px 8px -2px rgba(9, 30, 66, 0.25)"));
export var clickSelectWrapperStyle = css(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n  user-select: all;\n"])));