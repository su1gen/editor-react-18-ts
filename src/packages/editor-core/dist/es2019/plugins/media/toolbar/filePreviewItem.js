import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MediaViewer } from '@atlaskit/media-viewer';
import { messages } from '@atlaskit/media-ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import ToolbarButton from '../../floating-toolbar/ui/Button';
import { getSelectedMediaContainerNodeAttrs } from './utils';
export const FilePreviewItem = ({
  mediaPluginState,
  intl
}) => {
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);

  const openMediaViewer = () => {
    setMediaViewerVisible(true);
  };

  const onMediaViewerClose = () => {
    setMediaViewerVisible(false);
  };

  const renderMediaViewer = () => {
    if (isMediaViewerVisible) {
      const dataSource = {
        list: []
      };
      const selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(mediaPluginState);

      if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
        const {
          id,
          collection = ''
        } = selectedNodeAttrs;
        const identifier = {
          id,
          mediaItemType: 'file',
          collectionName: collection
        };
        return /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React.createElement(MediaViewer, {
          collectionName: collection,
          dataSource: dataSource,
          mediaClientConfig: mediaPluginState.mediaClientConfig,
          selectedItem: identifier,
          onClose: onMediaViewerClose
        }), document.body);
      }
    }

    return null;
  };

  const mediaViewer = renderMediaViewer();
  const tooltipContent = intl.formatMessage(messages.preview);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ToolbarButton, {
    testId: "file-preview-toolbar-button",
    key: "editor.media.card.preview",
    onClick: openMediaViewer,
    icon: /*#__PURE__*/React.createElement(FilePreviewIcon, {
      label: "file preview"
    }),
    tooltipContent: tooltipContent
  }), mediaViewer);
};