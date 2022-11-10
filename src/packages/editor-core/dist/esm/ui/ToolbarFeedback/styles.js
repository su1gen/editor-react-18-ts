import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A, N400, P400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
export var buttonContent = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  height: 24px;\n  line-height: 24px;\n  min-width: 70px;\n"])));
export var wrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  margin-right: 0;\n"])));
export var confirmationPopup = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  overflow: auto;\n  max-height: none;\n  height: 410px;\n  width: 280px;\n"])), token('elevation.surface.overlay', '#fff'), borderRadius(), token('elevation.shadow.overlay', "0 4px 8px -2px ".concat(N60A, ", 0 0 1px ").concat(N60A)));
export var confirmationText = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  font-size: ", ";\n  word-spacing: 4px;\n  line-height: 22px;\n  color: ", ";\n  margin-top: 30px;\n  padding: 20px;\n  & > div {\n    width: 240px;\n  }\n  & > div:first-of-type {\n    margin-bottom: 12px;\n  }\n  & > div:nth-of-type(2) {\n    margin-bottom: 20px;\n  }\n"])), relativeFontSizeToBase16(14), token('color.text.subtle', N400));
export var confirmationHeader = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  background-color: ", ";\n  height: 100px;\n  width: 100%;\n  display: inline-block;\n"])), token('color.background.discovery.bold', P400));
export var confirmationImg = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  width: 100px;\n  display: block;\n  margin: 25px auto 0 auto;\n"])));