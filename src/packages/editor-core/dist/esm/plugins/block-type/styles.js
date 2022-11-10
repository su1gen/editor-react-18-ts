import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { blockquoteSharedStyles, headingsSharedStyles } from '@atlaskit/editor-common/styles';
export var blocktypeStyles = function blocktypeStyles(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    ", ";\n    ", ";\n  }\n"])), blockquoteSharedStyles, headingsSharedStyles(props));
};