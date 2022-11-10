"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropzoneWrapper = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _mediaPicker = require("@atlaskit/media-picker");

var _PickerFacadeProvider = _interopRequireDefault(require("./PickerFacadeProvider"));

var _ui = require("@atlaskit/editor-common/ui");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var DropzoneWrapper = function DropzoneWrapper(_ref) {
  var mediaState = _ref.mediaState,
      isActive = _ref.isActive,
      featureFlags = _ref.featureFlags,
      editorDomElement = _ref.editorDomElement,
      appearance = _ref.appearance;
  return /*#__PURE__*/_react.default.createElement(_PickerFacadeProvider.default, {
    mediaState: mediaState,
    analyticsName: "dropzone"
  }, function (_ref2) {
    var mediaClientConfig = _ref2.mediaClientConfig,
        config = _ref2.config,
        pickerFacadeInstance = _ref2.pickerFacadeInstance;
    var customDropzoneContainer = mediaState.options.customDropzoneContainer,
        handleDrag = mediaState.handleDrag;
    var editorHtmlElement = editorDomElement;
    var scrollParent = appearance === 'full-page' && (0, _ui.findOverflowScrollParent)(editorHtmlElement);
    var container = customDropzoneContainer || (scrollParent ? scrollParent : editorHtmlElement);

    var dropzoneConfig = _objectSpread(_objectSpread({}, config), {}, {
      container: container
    });

    return isActive ? /*#__PURE__*/_react.default.createElement(_mediaPicker.Dropzone, {
      mediaClientConfig: mediaClientConfig,
      config: dropzoneConfig,
      onError: pickerFacadeInstance.handleUploadError,
      onPreviewUpdate: pickerFacadeInstance.handleUploadPreviewUpdate,
      onEnd: pickerFacadeInstance.handleReady,
      onDragEnter: function onDragEnter() {
        return handleDrag('enter');
      },
      onDragLeave: function onDragLeave() {
        return handleDrag('leave');
      },
      featureFlags: featureFlags
    }) : null;
  });
};

exports.DropzoneWrapper = DropzoneWrapper;