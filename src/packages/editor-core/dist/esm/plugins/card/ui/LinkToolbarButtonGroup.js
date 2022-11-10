import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
var _excluded = ["disabled"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { ButtonGroup } from '@atlaskit/button';
import Button from '../../floating-toolbar/ui/Button';
/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */

var buttonStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  pointer-events: auto;\n"])));
var buttonStyleNoneEvent = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  pointer-events: none;\n"])));

var DisallowedWrapper = function DisallowedWrapper(_ref) {
  var disabled = _ref.disabled,
      props = _objectWithoutProperties(_ref, _excluded);

  return jsx("div", props);
};
/**
 * The button requires `pointer-events: none;` in order to fix the tooltip, hence
 * leaving us without a disabled cursor, the following fixes this:
 */


var defaultWrapperStyle = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  cursor: pointer;\n"])));
var disallowedWrapperStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  cursor: not-allowed;\n"])));
export var LinkToolbarButtonGroup = function LinkToolbarButtonGroup(_ref2) {
  var options = _ref2.options;
  return jsx(ButtonGroup, null, options.map(function (_ref3) {
    var onClick = _ref3.onClick,
        selected = _ref3.selected,
        disabled = _ref3.disabled,
        testId = _ref3.testId,
        tooltipContent = _ref3.tooltipContent,
        title = _ref3.title,
        Icon = _ref3.icon;
    return jsx(DisallowedWrapper, {
      css: disabled ? disallowedWrapperStyle : defaultWrapperStyle,
      key: testId,
      disabled: disabled
    }, jsx(Button, {
      css: disabled ? buttonStyleNoneEvent : buttonStyle,
      title: title,
      icon: jsx(Icon, {
        size: "medium",
        label: title
      }),
      selected: selected,
      onClick: onClick,
      testId: testId,
      disabled: disabled,
      tooltipContent: tooltipContent
    }));
  }));
};