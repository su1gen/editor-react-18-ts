"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilePreviewItem = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _mediaViewer = require("@atlaskit/media-viewer");

var _mediaUi = require("@atlaskit/media-ui");

var _filePreview = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/file-preview"));

var _Button = _interopRequireDefault(require("../../floating-toolbar/ui/Button"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FilePreviewItem = function FilePreviewItem(_ref) {
  var mediaPluginState = _ref.mediaPluginState,
      intl = _ref.intl;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
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
      var selectedNodeAttrs = (0, _utils.getSelectedMediaContainerNodeAttrs)(mediaPluginState);

      if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
        var id = selectedNodeAttrs.id,
            _selectedNodeAttrs$co = selectedNodeAttrs.collection,
            collection = _selectedNodeAttrs$co === void 0 ? '' : _selectedNodeAttrs$co;
        var identifier = {
          id: id,
          mediaItemType: 'file',
          collectionName: collection
        };
        return /*#__PURE__*/_reactDom.default.createPortal( /*#__PURE__*/_react.default.createElement(_mediaViewer.MediaViewer, {
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
  var tooltipContent = intl.formatMessage(_mediaUi.messages.preview);
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    testId: "file-preview-toolbar-button",
    key: "editor.media.card.preview",
    onClick: openMediaViewer,
    icon: /*#__PURE__*/_react.default.createElement(_filePreview.default, {
      label: "file preview"
    }),
    tooltipContent: tooltipContent
  }), mediaViewer);
};

exports.FilePreviewItem = FilePreviewItem;