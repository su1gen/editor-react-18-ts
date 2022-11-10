import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css } from '@emotion/react';
import { N60, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
export var replaceSectionButtonStyles = css({
  marginLeft: '4px'
});
export var ruleStyles = css({
  width: '100%',
  border: 'none',
  backgroundColor: "".concat(token('color.border', N30A)),
  margin: '4px 0px',
  height: '1px',
  borderRadius: '1px'
});
export var wrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  '> *:not(#replace-hr-element)': {
    margin: '0px 4px'
  }
});
export var sectionWrapperStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n\n  & > * {\n    display: inline-flex;\n    height: 32px;\n    flex: 0 0 auto;\n  }\n\n  & > [data-ds--text-field--container] {\n    display: flex;\n    flex: 1 1 auto;\n  }\n"])));
export var countStyles = css({
  color: "".concat(token('color.text.subtlest', N60)),
  fontSize: "".concat(relativeFontSizeToBase16(12)),
  flex: '0 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '4px',
  marginRight: '8px'
});