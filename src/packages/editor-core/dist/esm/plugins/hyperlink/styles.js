import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css } from '@emotion/react';
import { linkSharedStyle } from '@atlaskit/editor-common/styles';
export var linkStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    ", "\n  }\n"])), linkSharedStyle);
/**
 * Visible only to screenreaders. Use when there is a need
 * to provide more context to a non-sighted user.
 */

export var visuallyHiddenStyles = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  clip: rect(1px, 1px, 1px, 1px);\n  clip-path: inset(50%);\n  height: 1px;\n  width: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n"])));