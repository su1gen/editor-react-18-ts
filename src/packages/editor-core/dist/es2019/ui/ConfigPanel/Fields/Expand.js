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
export const expandContainer = css`
  border-bottom: 1px solid ${token('color.border', N40)};
`;
export const expandControl = css`
  display: flex;
  height: ${gridSize() * 6}px;
  justify-content: center;
  padding-right: ${gridSize()}px;
`;
const chevronContainer = css`
  display: flex;
  align-items: center;

  & > button {
    width: ${gridSize() * 3}px;
    height: ${gridSize() * 3}px;
  }
`;
const labelContainer = css`
  width: 100%;
  align-items: center;
  display: flex;
  font-weight: 500;
`;

const expandContentContainer = isHidden => css`
  display: ${isHidden ? 'none' : 'block'};
  margin-top: -${gridSize()}px;
`;

function Expand({
  field,
  children,
  isExpanded = false,
  intl
}) {
  const [expanded, setExpanded] = useState(isExpanded);
  return jsx("div", {
    css: expandContainer
  }, jsx("div", {
    css: expandControl
  }, jsx("div", {
    css: labelContainer
  }, field.label), jsx("div", {
    css: chevronContainer
  }, jsx(Button, {
    onClick: () => {
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