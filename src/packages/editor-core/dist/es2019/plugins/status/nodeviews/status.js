/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { Status } from '@atlaskit/status/element';
import { messages } from './messages';
const styledStatus = css`
  opacity: 1;
`;
const styledStatusPlaceholder = css`
  opacity: 0.5;
`;

const StatusContainerView = props => {
  const {
    text,
    color,
    localId,
    style,
    intl: {
      formatMessage
    }
  } = props;
  const statusText = text ? text : formatMessage(messages.placeholder);

  const handleClick = event => {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    } // handling of popup is done in plugin.apply on selection change.

  };

  return jsx("span", {
    css: text ? styledStatus : styledStatusPlaceholder
  }, jsx(Status, {
    text: statusText,
    color: color,
    localId: localId,
    style: style,
    onClick: handleClick
  }));
};

export const IntlStatusContainerView = injectIntl(StatusContainerView);
export const StatusNodeView = props => {
  const {
    view
  } = props;
  const {
    text,
    color,
    localId,
    style
  } = props.node.attrs;
  return jsx(IntlStatusContainerView, {
    view: view,
    text: text,
    color: color,
    style: style,
    localId: localId
  });
};