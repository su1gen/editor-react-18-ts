/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { ButtonGroup } from '@atlaskit/button';
import Button from '../../floating-toolbar/ui/Button';
/**
 * Applying `pointer-events: none;` when disabled allows the Tooltip to be displayed
 */

const buttonStyle = css`
  pointer-events: auto;
`;
const buttonStyleNoneEvent = css`
  pointer-events: none;
`;

const DisallowedWrapper = ({
  disabled,
  ...props
}) => {
  return jsx("div", props);
};
/**
 * The button requires `pointer-events: none;` in order to fix the tooltip, hence
 * leaving us without a disabled cursor, the following fixes this:
 */


const defaultWrapperStyle = css`
  cursor: pointer;
`;
const disallowedWrapperStyle = css`
  cursor: not-allowed;
`;
export const LinkToolbarButtonGroup = ({
  options
}) => {
  return jsx(ButtonGroup, null, options.map(({
    onClick,
    selected,
    disabled,
    testId,
    tooltipContent,
    title,
    icon: Icon
  }) => jsx(DisallowedWrapper, {
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
  }))));
};