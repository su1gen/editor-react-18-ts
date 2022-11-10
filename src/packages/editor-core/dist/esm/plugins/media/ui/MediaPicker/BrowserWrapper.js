import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { Browser } from '@atlaskit/media-picker';
export var BrowserWrapper = function BrowserWrapper(_ref) {
  var mediaState = _ref.mediaState,
      isOpen = _ref.isOpen,
      onBrowseFn = _ref.onBrowseFn,
      featureFlags = _ref.featureFlags;
  return /*#__PURE__*/React.createElement(PickerFacadeProvider, {
    mediaState: mediaState,
    analyticsName: "browser"
  }, function (_ref2) {
    var mediaClientConfig = _ref2.mediaClientConfig,
        config = _ref2.config,
        pickerFacadeInstance = _ref2.pickerFacadeInstance;

    var browserConfig = _objectSpread(_objectSpread({}, config), {}, {
      multiple: true
    });

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
};