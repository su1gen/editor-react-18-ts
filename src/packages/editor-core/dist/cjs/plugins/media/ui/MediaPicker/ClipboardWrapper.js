"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClipboardWrapper = void 0;

var _react = _interopRequireDefault(require("react"));

var _PickerFacadeProvider = _interopRequireDefault(require("./PickerFacadeProvider"));

var _mediaPicker = require("@atlaskit/media-picker");

var ClipboardWrapper = function ClipboardWrapper(_ref) {
  var mediaState = _ref.mediaState,
      featureFlags = _ref.featureFlags;
  return /*#__PURE__*/_react.default.createElement(_PickerFacadeProvider.default, {
    mediaState: mediaState,
    analyticsName: "clipboard"
  }, function (_ref2) {
    var mediaClientConfig = _ref2.mediaClientConfig,
        config = _ref2.config,
        pickerFacadeInstance = _ref2.pickerFacadeInstance;
    return /*#__PURE__*/_react.default.createElement(_mediaPicker.Clipboard, {
      mediaClientConfig: mediaClientConfig,
      config: config,
      onError: pickerFacadeInstance.handleUploadError,
      onPreviewUpdate: pickerFacadeInstance.handleUploadPreviewUpdate,
      onEnd: pickerFacadeInstance.handleReady,
      featureFlags: featureFlags
    });
  });
};

exports.ClipboardWrapper = ClipboardWrapper;