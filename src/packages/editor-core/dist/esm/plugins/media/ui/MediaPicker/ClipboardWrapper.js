import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Clipboard } from '@atlaskit/media-picker';
export var ClipboardWrapper = function ClipboardWrapper(_ref) {
  var mediaState = _ref.mediaState,
      featureFlags = _ref.featureFlags;
  return /*#__PURE__*/React.createElement(PickerFacadeProvider, {
    mediaState: mediaState,
    analyticsName: "clipboard"
  }, function (_ref2) {
    var mediaClientConfig = _ref2.mediaClientConfig,
        config = _ref2.config,
        pickerFacadeInstance = _ref2.pickerFacadeInstance;
    return /*#__PURE__*/React.createElement(Clipboard, {
      mediaClientConfig: mediaClientConfig,
      config: config,
      onError: pickerFacadeInstance.handleUploadError,
      onPreviewUpdate: pickerFacadeInstance.handleUploadPreviewUpdate,
      onEnd: pickerFacadeInstance.handleReady,
      featureFlags: featureFlags
    });
  });
};