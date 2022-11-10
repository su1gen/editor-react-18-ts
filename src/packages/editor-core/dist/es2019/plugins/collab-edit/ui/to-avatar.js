import React from 'react';
import memoizeOne from 'memoize-one';
import { ColoredAvatarItem } from './colored-avatar-item';

const toAvatar = participant => ({
  name: participant.name,
  src: participant.avatar,
  size: 'medium',
  presence: /*#__PURE__*/React.createElement(ColoredAvatarItem, {
    name: participant.name,
    sessionId: participant.sessionId
  })
});

export default memoizeOne(toAvatar, function participantEquals([a], [b]) {
  return a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId;
});