import React from 'react';
import Mention from '../ui/Mention';
export var MentionNodeView = function MentionNodeView(props) {
  var providerFactory = props.providerFactory;
  var _props$node$attrs = props.node.attrs,
      id = _props$node$attrs.id,
      text = _props$node$attrs.text,
      accessLevel = _props$node$attrs.accessLevel;
  return /*#__PURE__*/React.createElement(Mention, {
    id: id,
    text: text,
    accessLevel: accessLevel,
    providers: providerFactory
  });
};