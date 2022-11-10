import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { akEditorUnitZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { N400 } from '@atlaskit/theme/colors';
export var header = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  z-index: ", ";\n  min-height: 24px;\n  padding: 20px 40px;\n  font-size: ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  box-shadow: 'none';\n  color: ", ";\n  background-color: ", ";\n  border-radius: ", "px;\n"])), akEditorUnitZIndex, relativeFontSizeToBase16(24), token('color.text', colors.N400), token('color.background.neutral.subtle', colors.N0), borderRadius());
export var footer = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  z-index: ", ";\n  font-size: ", ";\n  line-height: 20px;\n  color: ", ";\n  padding: 24px;\n  text-align: right;\n  box-shadow: 'none';\n"])), akEditorUnitZIndex, relativeFontSizeToBase16(14), token('color.text.subtlest', colors.N300));
export var contentWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding: 20px 44px;\n  border-bottom-right-radius: ", "px;\n  overflow: auto;\n  position: relative;\n  color: ", ";\n  background-color: ", ";\n"])), borderRadius(), token('color.text.subtle', colors.N400), token('color.background.neutral.subtle', colors.N0));
export var line = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  background: ", ";\n  content: '';\n  display: block;\n  height: 2px;\n  left: 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  min-width: 604px;\n"])), token('color.background.neutral.subtle', '#fff'));
export var content = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  min-width: 524px;\n  width: 100%;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n"])));
export var column = {
  width: '44%',
  '& > ul': {
    padding: 0
  }
};
export var row = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  margin: 20px 0;\n  display: flex;\n  justify-content: space-between;\n"])));
export var dialogHeader = {
  '&': {
    fontSize: relativeFontSizeToBase16(24),
    fontWeight: 400,
    color: token('color.text.subtle', N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143
  }
};
export var title = {
  '&': {
    fontSize: relativeFontSizeToBase16(18),
    fontWeight: 400,
    color: token('color.text.subtle', N400),
    letterSpacing: 'normal',
    lineHeight: 1.42857142857143
  }
};
export var codeSm = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  background-color: ", ";\n  border-radius: ", "px;\n  width: 24px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  text-align: center;\n"])), token('color.background.neutral', colors.N20), borderRadius());
export var codeMd = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  background-color: ", ";\n  border-radius: ", "px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  width: 50px;\n  text-align: center;\n"])), token('color.background.neutral', colors.N20), borderRadius());
export var codeLg = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  background-color: ", ";\n  border-radius: ", "px;\n  display: inline-block;\n  height: 24px;\n  line-height: 24px;\n  padding: 0 10px;\n  text-align: center;\n"])), token('color.background.neutral', colors.N20), borderRadius());