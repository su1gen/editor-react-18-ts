import React from 'react';
import { Dropzone } from '@atlaskit/media-picker';
import PickerFacadeProvider from './PickerFacadeProvider';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
export const DropzoneWrapper = ({
  mediaState,
  isActive,
  featureFlags,
  editorDomElement,
  appearance
}) => /*#__PURE__*/React.createElement(PickerFacadeProvider, {
  mediaState: mediaState,
  analyticsName: "dropzone"
}, ({
  mediaClientConfig,
  config,
  pickerFacadeInstance
}) => {
  const {
    options: {
      customDropzoneContainer
    },
    handleDrag
  } = mediaState;
  const editorHtmlElement = editorDomElement;
  const scrollParent = appearance === 'full-page' && findOverflowScrollParent(editorHtmlElement);
  const container = customDropzoneContainer || (scrollParent ? scrollParent : editorHtmlElement);
  const dropzoneConfig = { ...config,
    container
  };
  return isActive ? /*#__PURE__*/React.createElement(Dropzone, {
    mediaClientConfig: mediaClientConfig,
    config: dropzoneConfig,
    onError: pickerFacadeInstance.handleUploadError,
    onPreviewUpdate: pickerFacadeInstance.handleUploadPreviewUpdate,
    onEnd: pickerFacadeInstance.handleReady,
    onDragEnter: () => handleDrag('enter'),
    onDragLeave: () => handleDrag('leave'),
    featureFlags: featureFlags
  }) : null;
});