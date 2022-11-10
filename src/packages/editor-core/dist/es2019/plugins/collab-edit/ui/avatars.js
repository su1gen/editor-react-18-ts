/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import AvatarGroup from '@atlaskit/avatar-group';
import { avatarContainer } from './styles';
import toAvatar from './to-avatar';
import { scrollToCollabCursor } from '../utils';
import { getFeatureFlags } from '../../feature-flags-context';
export const Avatars = /*#__PURE__*/React.memo(props => {
  const {
    sessionId,
    editorView
  } = props;
  const participants = props.participants.toArray();
  const avatars = participants.sort(p => p.sessionId === sessionId ? -1 : 1).map(toAvatar);

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
    onAvatarClick: (_event, _analytics, index) => {
      if (!editorView) {
        return;
      }

      const featureFlags = getFeatureFlags(editorView.state);
      const allowCollabAvatarScroll = featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.collabAvatarScroll; // user does not need to scroll to their own position (index 0)

      if (allowCollabAvatarScroll && index > 0) {
        scrollToCollabCursor(editorView, participants, props.sessionId, index);
      }
    }
  }), props.children);
});