import React from 'react';
import Emoji from '../ui/Emoji';
export function EmojiNodeView(props) {
  const {
    shortName,
    id,
    text
  } = props.node.attrs;
  return /*#__PURE__*/React.createElement(Emoji, {
    providers: props.providerFactory,
    id: id,
    shortName: shortName,
    fallback: text
  });
}