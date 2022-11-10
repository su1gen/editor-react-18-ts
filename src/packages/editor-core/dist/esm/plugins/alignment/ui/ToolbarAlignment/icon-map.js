import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import EditorAlignRightIcon from '@atlaskit/icon/glyph/editor/align-right';
import EditorAlignCenterIcon from '@atlaskit/icon/glyph/editor/align-center';
import { useIntl } from 'react-intl-next';
import { messages } from './messages';
import React from 'react';
var iconAndMessageMap = {
  start: {
    Component: EditorAlignLeftIcon,
    label: messages.alignLeft
  },
  end: {
    Component: EditorAlignRightIcon,
    label: messages.alignRight
  },
  center: {
    Component: EditorAlignCenterIcon,
    label: messages.alignCenter
  }
};
export var IconMap = function IconMap(props) {
  var _iconAndMessageMap$pr = iconAndMessageMap[props.alignment],
      Component = _iconAndMessageMap$pr.Component,
      label = _iconAndMessageMap$pr.label;
  var intl = useIntl();
  return /*#__PURE__*/React.createElement(Component, {
    label: intl.formatMessage(label)
  });
};