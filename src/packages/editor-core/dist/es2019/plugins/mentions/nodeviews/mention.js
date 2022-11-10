import React from 'react';
import Mention from '../ui/Mention';
export const MentionNodeView = props => {
  const {
    providerFactory
  } = props;
  const {
    id,
    text,
    accessLevel
  } = props.node.attrs;
  return /*#__PURE__*/React.createElement(Mention, {
    id: id,
    text: text,
    accessLevel: accessLevel,
    providers: providerFactory
  });
};