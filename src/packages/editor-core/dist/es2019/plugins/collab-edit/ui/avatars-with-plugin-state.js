import React from 'react';
import { injectIntl } from 'react-intl-next';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as collabEditPluginKey } from '../plugin';
import messages from '../../../messages';
import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';

const AvatarsWithPluginState = props => {
  const title = props.intl.formatMessage(messages.inviteToEditButtonTitle);
  const {
    isInviteToEditButtonSelected: selected,
    inviteToEditHandler: onClick,
    inviteToEditComponent: Component,
    editorView
  } = props;
  const render = React.useCallback(({
    data
  }) => {
    if (!data) {
      return null;
    }

    return /*#__PURE__*/React.createElement(Avatars, {
      sessionId: data.sessionId,
      participants: data.activeParticipants,
      editorView: editorView
    }, /*#__PURE__*/React.createElement(InviteToEditButton, {
      title: title,
      selected: selected,
      onClick: onClick,
      Component: Component
    }));
  }, [selected, onClick, Component, title, editorView]);
  return /*#__PURE__*/React.createElement(WithPluginState, {
    plugins: {
      data: collabEditPluginKey
    },
    render: render,
    editorView: editorView
  });
};

export default injectIntl(AvatarsWithPluginState);