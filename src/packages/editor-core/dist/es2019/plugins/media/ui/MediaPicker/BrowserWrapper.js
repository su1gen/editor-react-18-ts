import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Browser } from '@atlaskit/media-picker';
export const BrowserWrapper = ({
  mediaState,
  isOpen,
  onBrowseFn,
  featureFlags
}) => /*#__PURE__*/React.createElement(PickerFacadeProvider, {
  mediaState: mediaState,
  analyticsName: "browser"
}, ({
  mediaClientConfig,
  config,
  pickerFacadeInstance
}) => {
  const browserConfig = { ...config,
    multiple: true
  };
  return /*#__PURE__*/React.createElement(Browser, {
    onBrowseFn: onBrowseFn,
    isOpen: isOpen,
    config: browserConfig,
    mediaClientConfig: mediaClientConfig,
    onEnd: pickerFacadeInstance.handleReady,
    onError: pickerFacadeInstance.handleUploadError,
    onPreviewUpdate: pickerFacadeInstance.handleUploadPreviewUpdate,
    featureFlags: featureFlags
  });
});