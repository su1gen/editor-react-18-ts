import React from 'react';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import WithPluginState from '../../../../ui/WithPluginState';
import { toolbarMediaMessages } from './toolbar-media-messages';
import { injectIntl } from 'react-intl-next';

var onClickMediaButton = function onClickMediaButton(pluginState) {
  return function () {
    pluginState.showMediaPicker();
    return true;
  };
};

var ToolbarMedia = function ToolbarMedia(_ref) {
  var editorView = _ref.editorView,
      eventDispatcher = _ref.eventDispatcher,
      pluginKey = _ref.pluginKey,
      isDisabled = _ref.isDisabled,
      isReducedSpacing = _ref.isReducedSpacing,
      intl = _ref.intl;
  return /*#__PURE__*/React.createElement(WithPluginState, {
    editorView: editorView,
    eventDispatcher: eventDispatcher,
    plugins: {
      mediaPlugin: pluginKey
    },
    render: function render(_ref2) {
      var mediaPlugin = _ref2.mediaPlugin;

      if (!(mediaPlugin !== null && mediaPlugin !== void 0 && mediaPlugin.allowsUploads)) {
        return null;
      }

      var toolbarMediaTitle = toolbarMediaMessages.toolbarMediaTitle;
      return /*#__PURE__*/React.createElement(ToolbarButton, {
        buttonId: TOOLBAR_BUTTON.MEDIA,
        onClick: onClickMediaButton(mediaPlugin),
        disabled: isDisabled,
        title: intl.formatMessage(toolbarMediaTitle),
        spacing: isReducedSpacing ? 'none' : 'default',
        iconBefore: /*#__PURE__*/React.createElement(AttachmentIcon, {
          label: intl.formatMessage(toolbarMediaTitle)
        })
      });
    }
  });
};

export default injectIntl(ToolbarMedia);