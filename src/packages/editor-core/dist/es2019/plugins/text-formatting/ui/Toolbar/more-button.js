/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { triggerWrapperStyles } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
export const MoreButton = /*#__PURE__*/React.memo(({
  label,
  'aria-expanded': ariaExpanded,
  isReducedSpacing,
  isSelected,
  isDisabled,
  onClick
}) => {
  return jsx(ToolbarButton, {
    disabled: isDisabled,
    selected: isSelected,
    onClick: onClick,
    spacing: isReducedSpacing ? 'none' : 'default',
    title: label,
    iconBefore: jsx("div", {
      css: triggerWrapperStyles
    }, jsx(MoreIcon, {
      label: ""
    })),
    "aria-expanded": ariaExpanded,
    "aria-label": label,
    "aria-haspopup": true
  });
});