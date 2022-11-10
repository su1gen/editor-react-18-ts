import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

import { css } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';
import { N20 } from '@atlaskit/theme/colors';
import { akEditorSmallZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
export var inviteTeamWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: ", ";\n  border-radius: 50%;\n  min-width: ", "px;\n  margin-left: -", "px;\n"])), token('color.background.neutral', N20), gridSize() * 4, gridSize() / 2);
export var avatarContainer = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-right: ", "px;\n  display: flex;\n  align-items: center;\n\n  // ED-13102: This is to override list styles that come from the\n  // .wiki-content class in Confluence that should not apply within\n  // the toolbar. Has to be extra specific to override.\n  && > ul {\n    list-style-type: none;\n  }\n\n  div:last-child button.invite-to-edit {\n    border-radius: 50%;\n    height: 32px;\n    width: 32px;\n    padding: 2px;\n  }\n"])), gridSize());
export var badge = function badge(color) {
  return css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: block;\n  position: absolute;\n  right: 1px;\n  bottom: 1px;\n  width: 13px;\n  height: 13px;\n  z-index: ", ";\n  border-radius: 3px;\n  background: ", ";\n  color: ", ";\n  font-size: ", ";\n  line-height: 0;\n  padding-top: 7px;\n  text-align: center;\n  box-shadow: 0 0 1px ", ";\n  box-sizing: border-box;\n"])), akEditorSmallZIndex, color, token('color.text.inverse', '#fff'), relativeFontSizeToBase16(9), token('color.border.inverse', '#fff'));
};