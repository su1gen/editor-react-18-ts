/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { triggerWrapperStyles } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
export var MoreButton = /*#__PURE__*/React.memo(function (_ref) {
  var label = _ref.label,
      ariaExpanded = _ref['aria-expanded'],
      isReducedSpacing = _ref.isReducedSpacing,
      isSelected = _ref.isSelected,
      isDisabled = _ref.isDisabled,
      onClick = _ref.onClick;
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