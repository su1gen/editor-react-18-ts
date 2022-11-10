import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["buttonStyles"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { getButtonStyles, iconOnlySpacing } from './styles';
export default (function (_ref) {
  var title = _ref.title,
      icon = _ref.icon,
      iconAfter = _ref.iconAfter,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      selected = _ref.selected,
      disabled = _ref.disabled,
      href = _ref.href,
      target = _ref.target,
      _ref$appearance = _ref.appearance,
      appearance = _ref$appearance === void 0 ? 'subtle' : _ref$appearance,
      children = _ref.children,
      className = _ref.className,
      tooltipContent = _ref.tooltipContent,
      testId = _ref.testId,
      _ref$hideTooltipOnCli = _ref.hideTooltipOnClick,
      hideTooltipOnClick = _ref$hideTooltipOnCli === void 0 ? true : _ref$hideTooltipOnCli,
      ariaHasPopup = _ref.ariaHasPopup,
      tabIndex = _ref.tabIndex;
  // Check if there's only an icon and add additional styles
  var iconOnly = (icon || iconAfter) && !children;
  var customSpacing = iconOnly ? iconOnlySpacing : {};
  return /*#__PURE__*/React.createElement(Tooltip, {
    content: tooltipContent || title,
    hideTooltipOnClick: hideTooltipOnClick,
    position: "top"
  }, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, /*#__PURE__*/React.createElement(Button, {
    className: className,
    theme: function theme(adgTheme, themeProps) {
      var _adgTheme = adgTheme(themeProps),
          buttonStyles = _adgTheme.buttonStyles,
          rest = _objectWithoutProperties(_adgTheme, _excluded);

      return _objectSpread({
        buttonStyles: _objectSpread(_objectSpread(_objectSpread({}, buttonStyles), customSpacing), appearance === 'danger' && getButtonStyles({
          appearance: appearance,
          state: themeProps.state,
          mode: themeProps.mode
        }))
      }, rest);
    },
    "aria-label": title,
    "aria-pressed": selected,
    spacing: 'compact',
    href: href,
    target: target,
    appearance: appearance,
    "aria-haspopup": ariaHasPopup,
    iconBefore: icon || undefined,
    iconAfter: iconAfter,
    onClick: onClick,
    isSelected: selected,
    isDisabled: disabled,
    testId: testId,
    onFocus: onFocus,
    onBlur: onBlur // @ts-ignore
    // tabIndex set as 0 by default in the design system  ButtonBase component
    // this is not expected for all buttons, we have to use tabIndex={null} for some cases
    // should be fixed here https://a11y-internal.atlassian.net/browse/DST-287
    ,
    tabIndex: tabIndex
  }, children)));
});