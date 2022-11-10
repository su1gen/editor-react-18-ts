import React from 'react';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

const ExtensionNodeWrapper = ({
  children,
  nodeType
}) => /*#__PURE__*/React.createElement("span", null, children, nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE);

export default ExtensionNodeWrapper;