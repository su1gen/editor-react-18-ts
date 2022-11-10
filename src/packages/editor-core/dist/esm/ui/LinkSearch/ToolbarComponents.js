import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

import { css } from '@emotion/react';
export var RECENT_SEARCH_WIDTH_IN_PX = 420;
export var RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = 360;
export var RECENT_SEARCH_HEIGHT_IN_PX = 360;
export var inputWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  line-height: 0;\n  padding: 5px 0;\n  align-items: center;\n"])));
export var container = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  padding: 0;\n\n  width: ", "px;\n  line-height: initial;\n"])), RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX);
export var containerWithProvider = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: ", "px;\n"])), RECENT_SEARCH_WIDTH_IN_PX);