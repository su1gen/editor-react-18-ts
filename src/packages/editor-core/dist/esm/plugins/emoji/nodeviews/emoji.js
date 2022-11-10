import React from 'react';
import Emoji from '../ui/Emoji';
export function EmojiNodeView(props) {
  var _props$node$attrs = props.node.attrs,
      shortName = _props$node$attrs.shortName,
      id = _props$node$attrs.id,
      text = _props$node$attrs.text;
  return /*#__PURE__*/React.createElement(Emoji, {
    providers: props.providerFactory,
    id: id,
    shortName: shortName,
    fallback: text
  });
}