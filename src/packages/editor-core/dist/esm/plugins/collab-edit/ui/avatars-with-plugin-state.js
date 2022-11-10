import React from 'react';
import { injectIntl } from 'react-intl-next';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as collabEditPluginKey } from '../plugin';
import messages from '../../../messages';
import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';

var AvatarsWithPluginState = function AvatarsWithPluginState(props) {
  var title = props.intl.formatMessage(messages.inviteToEditButtonTitle);
  var selected = props.isInviteToEditButtonSelected,
      onClick = props.inviteToEditHandler,
      Component = props.inviteToEditComponent,
      editorView = props.editorView;
  var render = React.useCallback(function (_ref) {
    var data = _ref.data;

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