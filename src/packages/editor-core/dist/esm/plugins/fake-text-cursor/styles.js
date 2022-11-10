import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { B75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var fakeCursorStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    .ProseMirror-fake-text-cursor {\n      display: inline;\n      pointer-events: none;\n      position: relative;\n    }\n\n    .ProseMirror-fake-text-cursor::after {\n      content: '';\n      display: inline;\n      top: 0;\n      position: absolute;\n      border-right: 1px solid ", ";\n    }\n\n    .ProseMirror-fake-text-selection {\n      display: inline;\n      pointer-events: none;\n      position: relative;\n      background-color: ", ";\n    }\n  }\n"])), token('color.border', 'rgba(0, 0, 0, 0.4)'), token('color.background.selected', B75));