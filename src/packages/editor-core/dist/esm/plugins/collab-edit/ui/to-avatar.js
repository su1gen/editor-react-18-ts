import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React from 'react';
import memoizeOne from 'memoize-one';
import { ColoredAvatarItem } from './colored-avatar-item';

var toAvatar = function toAvatar(participant) {
  return {
    name: participant.name,
    src: participant.avatar,
    size: 'medium',
    presence: /*#__PURE__*/React.createElement(ColoredAvatarItem, {
      name: participant.name,
      sessionId: participant.sessionId
    })
  };
};

export default memoizeOne(toAvatar, function participantEquals(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 1),
      a = _ref3[0];

  var _ref4 = _slicedToArray(_ref2, 1),
      b = _ref4[0];

  return a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId;
});