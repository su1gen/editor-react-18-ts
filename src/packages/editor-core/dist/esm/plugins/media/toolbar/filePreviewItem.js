import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MediaViewer } from '@atlaskit/media-viewer';
import { messages } from '@atlaskit/media-ui';
import FilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import ToolbarButton from '../../floating-toolbar/ui/Button';
import { getSelectedMediaContainerNodeAttrs } from './utils';
export var FilePreviewItem = function FilePreviewItem(_ref) {
  var mediaPluginState = _ref.mediaPluginState,
      intl = _ref.intl;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isMediaViewerVisible = _useState2[0],
      setMediaViewerVisible = _useState2[1];

  var openMediaViewer = function openMediaViewer() {
    setMediaViewerVisible(true);
  };

  var onMediaViewerClose = function onMediaViewerClose() {
    setMediaViewerVisible(false);
  };

  var renderMediaViewer = function renderMediaViewer() {
    if (isMediaViewerVisible) {
      var dataSource = {
        list: []
      };
      var selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(mediaPluginState);

      if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
        var id = selectedNodeAttrs.id,
            _selectedNodeAttrs$co = selectedNodeAttrs.collection,
            collection = _selectedNodeAttrs$co === void 0 ? '' : _selectedNodeAttrs$co;
        var identifier = {
          id: id,
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

  var mediaViewer = renderMediaViewer();
  var tooltipContent = intl.formatMessage(messages.preview);
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