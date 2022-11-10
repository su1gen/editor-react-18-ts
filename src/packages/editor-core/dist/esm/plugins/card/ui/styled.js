import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

import { css } from '@emotion/react';
export var embedCardStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    .embedCardView-content-wrap[layout^='wrap-'] {\n      max-width: 100%;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-left'] {\n      float: left;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-right'] {\n      float: right;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-right']\n      + .embedCardView-content-wrap[layout='wrap-left'] {\n      clear: both;\n    }\n  }\n"])));
export var embedSpacingStyles = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin: 0 10px;\n"])));