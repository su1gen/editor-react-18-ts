/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import AvatarGroup from '@atlaskit/avatar-group';
import { avatarContainer } from './styles';
import toAvatar from './to-avatar';
import { scrollToCollabCursor } from '../utils';
import { getFeatureFlags } from '../../feature-flags-context';
export var Avatars = /*#__PURE__*/React.memo(function (props) {
  var sessionId = props.sessionId,
      editorView = props.editorView;
  var participants = props.participants.toArray();
  var avatars = participants.sort(function (p) {
    return p.sessionId === sessionId ? -1 : 1;
  }).map(toAvatar);

  if (!avatars.length) {
    return null;
  }

  return jsx("div", {
    css: avatarContainer
  }, jsx(AvatarGroup, {
    appearance: "stack",
    size: "medium",
    data: avatars,
    maxCount: 3,
    onAvatarClick: function onAvatarClick(_event, _analytics, index) {
      if (!editorView) {
        return;
      }

      var featureFlags = getFeatureFlags(editorView.state);
      var allowCollabAvatarScroll = featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.collabAvatarScroll; // user does not need to scroll to their own position (index 0)

      if (allowCollabAvatarScroll && index > 0) {
        scrollToCollabCursor(editorView, participants, props.sessionId, index);
      }
    }
  }), props.children);
});