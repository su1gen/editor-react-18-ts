import React from 'react';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import WithPluginState from '../../../../ui/WithPluginState';
import { toolbarMediaMessages } from './toolbar-media-messages';
import { injectIntl } from 'react-intl-next';

const onClickMediaButton = pluginState => () => {
  pluginState.showMediaPicker();
  return true;
};

const ToolbarMedia = ({
  editorView,
  eventDispatcher,
  pluginKey,
  isDisabled,
  isReducedSpacing,
  intl
}) => /*#__PURE__*/React.createElement(WithPluginState, {
  editorView: editorView,
  eventDispatcher: eventDispatcher,
  plugins: {
    mediaPlugin: pluginKey
  },
  render: ({
    mediaPlugin
  }) => {
    if (!(mediaPlugin !== null && mediaPlugin !== void 0 && mediaPlugin.allowsUploads)) {
      return null;
    }

    const {
      toolbarMediaTitle
    } = toolbarMediaMessages;
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

export default injectIntl(ToolbarMedia);