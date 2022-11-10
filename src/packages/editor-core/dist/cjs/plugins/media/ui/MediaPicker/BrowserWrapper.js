"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserWrapper = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _PickerFacadeProvider = _interopRequireDefault(require("./PickerFacadeProvider"));

var _mediaPicker = require("@atlaskit/media-picker");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var BrowserWrapper = function BrowserWrapper(_ref) {
  var mediaState = _ref.mediaState,
      isOpen = _ref.isOpen,
      onBrowseFn = _ref.onBrowseFn,
      featureFlags = _ref.featureFlags;
  return /*#__PURE__*/_react.default.createElement(_PickerFacadeProvider.default, {
    mediaState: mediaState,
    analyticsName: "browser"
  }, function (_ref2) {
    var mediaClientConfig = _ref2.mediaClientConfig,
        config = _ref2.config,
        pickerFacadeInstance = _ref2.pickerFacadeInstance;

    var browserConfig = _objectSpread(_objectSpread({}, config), {}, {
      multiple: true
    });

    return /*#__PURE__*/_react.default.createElement(_mediaPicker.Browser, {
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

exports.BrowserWrapper = BrowserWrapper;