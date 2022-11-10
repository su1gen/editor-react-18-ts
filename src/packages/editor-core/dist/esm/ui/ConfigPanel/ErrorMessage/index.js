import React from 'react';
import EmptyState from '@atlaskit/empty-state';
import { defineMessages, injectIntl } from 'react-intl-next';
import ErrorImage from './ErrorImage';
var messages = defineMessages({
  configFailedToLoad: {
    id: 'fabric.editor.configFailedToLoad',
    defaultMessage: 'Failed to load',
    description: 'Displayed when the config panel fails to load fields'
  }
});

var ConfigPanelErrorMessage = function ConfigPanelErrorMessage(_ref) {
  var errorMessage = _ref.errorMessage,
      intl = _ref.intl;
  return /*#__PURE__*/React.createElement(EmptyState, {
    header: intl.formatMessage(messages.configFailedToLoad),
    description: errorMessage,
    renderImage: function renderImage() {
      return /*#__PURE__*/React.createElement(ErrorImage, null);
    },
    size: "narrow",
    imageHeight: 80
  });
};

export default injectIntl(ConfigPanelErrorMessage);