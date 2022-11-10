import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { TELEPOINTER_DIM_CLASS } from './plugin-state';
import { colors } from './utils';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

var telepointerColorStyle = function telepointerColorStyle(color, index) {
  return "\n  &.color-".concat(index, " {\n    background-color: ").concat(color.selection, ";\n    &::after {\n      background-color: ").concat(color.solid, ";\n      color: ").concat(token('color.text.inverse', '#fff'), ";\n      border-color: ").concat(color.solid, ";\n    }\n  }\n");
};

export var telepointerStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror .telepointer {\n    position: relative;\n    transition: opacity 200ms;\n\n    &.telepointer-selection {\n      line-height: 1.2;\n      pointer-events: none;\n      user-select: none;\n    }\n\n    &.telepointer-selection-badge::after {\n      content: attr(data-initial);\n      position: absolute;\n      display: block;\n      top: -14px;\n      font-size: ", ";\n      padding: 2px;\n      color: ", ";\n      left: -1px;\n      border-radius: 2px 2px 2px 0;\n      line-height: initial;\n    }\n\n    &.", " {\n      opacity: 0.2;\n    }\n\n    ", ";\n  }\n"])), relativeFontSizeToBase16(9), token('color.text.inverse', 'white'), TELEPOINTER_DIM_CLASS, colors.map(function (color, index) {
  return telepointerColorStyle(color, index);
}));