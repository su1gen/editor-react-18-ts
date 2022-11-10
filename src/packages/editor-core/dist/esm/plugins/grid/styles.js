import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { N30A, B200 } from '@atlaskit/theme/colors';
import { akEditorGridLineZIndex } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var GRID_GUTTER = 12;
export var gridStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .gridParent {\n    width: calc(100% + ", "px);\n    margin-left: -", "px;\n    margin-right: -", "px;\n    transform: scale(1);\n    z-index: ", ";\n  }\n\n  .gridContainer {\n    position: fixed;\n    height: 100vh;\n    width: 100%;\n    pointer-events: none;\n  }\n\n  // TODO: https://product-fabric.atlassian.net/browse/DSP-4352\n  .gridLine {\n    border-left: 1px solid ", ";\n    display: inline-block;\n    box-sizing: border-box;\n    height: 100%;\n    margin-left: -1px;\n\n    transition: border-color 0.15s linear;\n    z-index: 0;\n  }\n\n  .highlight {\n    border-left: 1px solid ", ";\n  }\n"])), GRID_GUTTER * 2, GRID_GUTTER, GRID_GUTTER, akEditorGridLineZIndex, token('color.border', N30A), token('color.border.focused', B200));