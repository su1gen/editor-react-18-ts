/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { FormattedMessage, defineMessages } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { buttonContentStyle, buttonContentReducedSpacingStyle, wrapperStyle, wrapperSmallStyle, expandIconWrapperStyle } from '../../../../ui/styles';
import { NORMAL_TEXT } from '../../types';
export const messages = defineMessages({
  textStyles: {
    id: 'fabric.editor.textStyles',
    defaultMessage: 'Text styles',
    description: 'Menu provides access to various heading styles or normal text'
  }
});
export const BlockTypeButton = props => {
  const labelTextStyles = props.formatMessage(messages.textStyles);
  return jsx(ToolbarButton, {
    spacing: props.isReducedSpacing ? 'none' : 'default',
    selected: props.selected,
    className: "block-type-btn",
    disabled: props.disabled,
    onClick: props.onClick,
    title: labelTextStyles,
    "aria-label": labelTextStyles,
    "aria-haspopup": true,
    "aria-expanded": props['aria-expanded'],
    iconAfter: jsx("span", {
      css: [wrapperStyle, props.isSmall && wrapperSmallStyle]
    }, props.isSmall && jsx(TextStyleIcon, {
      label: labelTextStyles
    }), jsx("span", {
      css: expandIconWrapperStyle
    }, jsx(ExpandIcon, {
      label: ""
    })))
  }, !props.isSmall && jsx("span", {
    css: [buttonContentStyle, props.isReducedSpacing && buttonContentReducedSpacingStyle]
  }, jsx(FormattedMessage, props.title || NORMAL_TEXT.title), jsx("div", {
    style: {
      overflow: 'hidden',
      height: 0
    }
  }, props.children)));
};