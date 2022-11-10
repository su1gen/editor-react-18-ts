import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme/constants';
import { messages } from '../messages';
export var expandContainer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-bottom: 1px solid ", ";\n"])), token('color.border', N40));
export var expandControl = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  height: ", "px;\n  justify-content: center;\n  padding-right: ", "px;\n"])), gridSize() * 6, gridSize());
var chevronContainer = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n\n  & > button {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), gridSize() * 3, gridSize() * 3);
var labelContainer = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  width: 100%;\n  align-items: center;\n  display: flex;\n  font-weight: 500;\n"])));

var expandContentContainer = function expandContentContainer(isHidden) {
  return css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: ", ";\n  margin-top: -", "px;\n"])), isHidden ? 'none' : 'block', gridSize());
};

function Expand(_ref) {
  var field = _ref.field,
      children = _ref.children,
      _ref$isExpanded = _ref.isExpanded,
      isExpanded = _ref$isExpanded === void 0 ? false : _ref$isExpanded,
      intl = _ref.intl;

  var _useState = useState(isExpanded),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  return jsx("div", {
    css: expandContainer
  }, jsx("div", {
    css: expandControl
  }, jsx("div", {
    css: labelContainer
  }, field.label), jsx("div", {
    css: chevronContainer
  }, jsx(Button, {
    onClick: function onClick() {
      setExpanded(!expanded);
    },
    testId: "form-expand-toggle",
    iconBefore: expanded ? jsx(ChevronDownIcon, {
      label: intl.formatMessage(messages.collapse)
    }) : jsx(ChevronRightIcon, {
      label: intl.formatMessage(messages.expand)
    })
  }))), jsx("div", {
    "data-testid": "expand-content-container",
    css: expandContentContainer(!expanded)
  }, children));
}

export default injectIntl(Expand);