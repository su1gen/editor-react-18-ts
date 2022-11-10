/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { gridSize } from '@atlaskit/theme/constants';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Tooltip from '@atlaskit/tooltip';
import { N80, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { messages } from '../messages';
const removableFieldWrapper = css`
  position: relative;
  margin-bottom: 0;
`;
const wrapperWithMarginBottom = css`
  margin-bottom: ${gridSize() * 2}px;
`;
const removeButtonWrapper = css`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;

  color: ${token('color.icon.subtle', N80)};

  &:hover {
    color: ${token('color.icon.danger', R300)};
  }
`;

const RemovableField = ({
  name,
  canRemoveField,
  onClickRemove,
  children,
  intl,
  className
}) => {
  var _children$props$field;

  const onClickCallback = React.useCallback(() => onClickRemove && onClickRemove(name), [name, onClickRemove]);
  const hasMarginBottom = ((_children$props$field = children.props.field) === null || _children$props$field === void 0 ? void 0 : _children$props$field.type) !== 'expand';
  return jsx("div", {
    css: [removableFieldWrapper, hasMarginBottom && wrapperWithMarginBottom],
    className: className
  }, children, canRemoveField && jsx("div", {
    css: removeButtonWrapper,
    "data-testid": `remove-field-${name}`,
    onClick: onClickCallback
  }, jsx(Tooltip, {
    content: intl.formatMessage(messages.removeField),
    position: "left"
  }, jsx(CrossCircleIcon, {
    size: "small",
    label: intl.formatMessage(messages.removeField)
  }))));
};

export default injectIntl(RemovableField);