/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { ToolTipContent } from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { expandIconWrapperStyle } from '../../../../ui/styles';
import { triggerWrapper } from './styles';
var DropDownButtonIcon = /*#__PURE__*/React.memo(function (props) {
  return jsx("span", {
    css: triggerWrapper
  }, jsx(AddIcon, {
    label: props.label
  }), jsx("span", {
    css: expandIconWrapperStyle
  }, jsx(ExpandIcon, {
    label: ""
  })));
});
export var DropDownButton = /*#__PURE__*/React.memo(function (props) {
  return jsx(ToolbarButton, {
    ref: props.handleRef,
    selected: props.selected,
    disabled: props.disabled,
    onClick: props.onClick,
    spacing: props.spacing,
    "aria-expanded": props['aria-expanded'],
    "aria-haspopup": props['aria-haspopup'],
    "aria-label": props.label,
    iconBefore: jsx(DropDownButtonIcon, {
      label: ""
    }),
    title: jsx(ToolTipContent, {
      description: props.label,
      shortcutOverride: "/"
    })
  });
});