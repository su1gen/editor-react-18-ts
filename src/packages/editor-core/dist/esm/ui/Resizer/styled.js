import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

import { css } from '@emotion/react';
import { MediaSingleDimensionHelper } from '@atlaskit/editor-common/ui';
export var wrapperStyle = function wrapperStyle(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  & > div {\n    ", ";\n    position: relative;\n    clear: both;\n\n    > div {\n      position: absolute;\n      height: 100%;\n      width: 100%;\n    }\n  }\n"])), MediaSingleDimensionHelper(props));
};