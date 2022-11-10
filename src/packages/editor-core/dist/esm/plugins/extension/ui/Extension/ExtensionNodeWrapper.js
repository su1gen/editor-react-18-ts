import React from 'react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

var ExtensionNodeWrapper = function ExtensionNodeWrapper(_ref) {
  var children = _ref.children,
      nodeType = _ref.nodeType;
  return /*#__PURE__*/React.createElement("span", null, children, nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE);
};

export default ExtensionNodeWrapper;