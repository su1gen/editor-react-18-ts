import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { getButtonStyles, iconOnlySpacing } from './styles';
export default (({
  title,
  icon,
  iconAfter,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  selected,
  disabled,
  href,
  target,
  appearance = 'subtle',
  children,
  className,
  tooltipContent,
  testId,
  hideTooltipOnClick = true,
  ariaHasPopup,
  tabIndex
}) => {
  // Check if there's only an icon and add additional styles
  const iconOnly = (icon || iconAfter) && !children;
  const customSpacing = iconOnly ? iconOnlySpacing : {};
  return /*#__PURE__*/React.createElement(Tooltip, {
    content: tooltipContent || title,
    hideTooltipOnClick: hideTooltipOnClick,
    position: "top"
  }, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, /*#__PURE__*/React.createElement(Button, {
    className: className,
    theme: (adgTheme, themeProps) => {
      const {
        buttonStyles,
        ...rest
      } = adgTheme(themeProps);
      return {
        buttonStyles: { ...buttonStyles,
          ...customSpacing,
          ...(appearance === 'danger' && getButtonStyles({
            appearance,
            state: themeProps.state,
            mode: themeProps.mode
          }))
        },
        ...rest
      };
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