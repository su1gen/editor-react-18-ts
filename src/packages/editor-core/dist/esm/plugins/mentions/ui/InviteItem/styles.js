import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

import { css } from '@emotion/react';
import { N30, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
export var ROW_SIDE_PADDING = 14;
export var rowStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  overflow: hidden;\n  padding: 6px ", "px;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n"])), ROW_SIDE_PADDING);
export var AVATAR_HEIGHT = 36;
export var avatarStyle = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: relative;\n  flex: initial;\n  opacity: inherit;\n  width: 36px;\n  height: ", "px;\n\n  > span {\n    width: 24px;\n    height: 24px;\n    padding: 6px;\n  }\n"])), AVATAR_HEIGHT);
export var nameSectionStyle = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  flex: 1;\n  min-width: 0;\n  margin-left: 14px;\n  color: ", ";\n  opacity: inherit;\n"])), token('color.text.subtle', N300));
export var mentionItemStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  background-color: transparent;\n  display: block;\n  overflow: hidden;\n  list-style-type: none;\n  cursor: pointer;\n"])));
export var mentionItemSelectedStyle = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  background-color: ", ";\n"])), token('color.background.neutral.subtle.hovered', N30));
export var capitalizedStyle = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  text-transform: capitalize;\n"])));