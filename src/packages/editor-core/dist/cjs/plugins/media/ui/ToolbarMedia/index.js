"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _attachment = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/attachment"));

var _ToolbarButton = _interopRequireWildcard(require("../../../../ui/ToolbarButton"));

var _WithPluginState = _interopRequireDefault(require("../../../../ui/WithPluginState"));

var _toolbarMediaMessages = require("./toolbar-media-messages");

var _reactIntlNext = require("react-intl-next");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var onClickMediaButton = function onClickMediaButton(pluginState) {
  return function () {
    pluginState.showMediaPicker();
    return true;
  };
};

var ToolbarMedia = function ToolbarMedia(_ref) {
  var editorView = _ref.editorView,
      eventDispatcher = _ref.eventDispatcher,
      pluginKey = _ref.pluginKey,
      isDisabled = _ref.isDisabled,
      isReducedSpacing = _ref.isReducedSpacing,
      intl = _ref.intl;
  return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
    editorView: editorView,
    eventDispatcher: eventDispatcher,
    plugins: {
      mediaPlugin: pluginKey
    },
    render: function render(_ref2) {
      var mediaPlugin = _ref2.mediaPlugin;

      if (!(mediaPlugin !== null && mediaPlugin !== void 0 && mediaPlugin.allowsUploads)) {
        return null;
      }

      var toolbarMediaTitle = _toolbarMediaMessages.toolbarMediaMessages.toolbarMediaTitle;
      return /*#__PURE__*/_react.default.createElement(_ToolbarButton.default, {
        buttonId: _ToolbarButton.TOOLBAR_BUTTON.MEDIA,
        onClick: onClickMediaButton(mediaPlugin),
        disabled: isDisabled,
        title: intl.formatMessage(toolbarMediaTitle),
        spacing: isReducedSpacing ? 'none' : 'default',
        iconBefore: /*#__PURE__*/_react.default.createElement(_attachment.default, {
          label: intl.formatMessage(toolbarMediaTitle)
        })
      });
    }
  });
};

var _default = (0, _reactIntlNext.injectIntl)(ToolbarMedia);

exports.default = _default;