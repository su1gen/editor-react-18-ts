"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkToolbarAppearance = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _link = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/link"));

var _shortcut = _interopRequireDefault(require("@atlaskit/icon/glyph/shortcut"));

var _adfSchema = require("@atlaskit/adf-schema");

var _checkMediaType = require("../utils/check-media-type");

var _Button = _interopRequireDefault(require("../../floating-toolbar/ui/Button"));

var _Separator = _interopRequireDefault(require("../../floating-toolbar/ui/Separator"));

var _messages = require("../../../messages");

var _keymaps = require("../../../keymaps");

var _pluginKey = require("../pm-plugins/plugin-key");

var _currentMediaNode = require("../utils/current-media-node");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// need this wrapper, need to have 4px between items.
var wrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n  margin-right: 4px;\n"])));

var LinkToolbarAppearance = function LinkToolbarAppearance(_ref) {
  var editorState = _ref.editorState,
      mediaLinkingState = _ref.mediaLinkingState,
      intl = _ref.intl,
      onAddLink = _ref.onAddLink,
      onEditLink = _ref.onEditLink,
      onOpenLink = _ref.onOpenLink;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      showLinkingControls = _useState2[0],
      setShowLinkingControls = _useState2[1];

  (0, _react.useEffect)(function () {
    var _stateKey$getState;

    setShowLinkingControls(false);
    var mediaNode = (0, _currentMediaNode.currentMediaNode)(editorState);

    if (!mediaNode) {
      return;
    }

    var mediaClientConfig = (_stateKey$getState = _pluginKey.stateKey.getState(editorState)) === null || _stateKey$getState === void 0 ? void 0 : _stateKey$getState.mediaClientConfig;

    if (!mediaClientConfig) {
      return;
    }

    (0, _checkMediaType.checkMediaType)(mediaNode, mediaClientConfig).then(function (mediaType) {
      if (mediaType === 'external' || mediaType === 'image') {
        setShowLinkingControls(true);
      }
    });
  }, [editorState]);

  if (!showLinkingControls) {
    return null;
  }

  if (mediaLinkingState && mediaLinkingState.editable) {
    var isValidUrl = (0, _adfSchema.isSafeUrl)(mediaLinkingState.link);
    var title = intl.formatMessage(_messages.linkToolbarMessages.editLink);
    var linkTitle = intl.formatMessage(isValidUrl ? _messages.linkMessages.openLink : _messages.linkToolbarMessages.unableToOpenLink);
    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", {
      css: wrapper
    }, (0, _react2.jsx)(_Button.default, {
      onClick: onEditLink,
      title: title,
      tooltipContent: (0, _react2.jsx)(_keymaps.ToolTipContent, {
        description: title,
        keymap: _keymaps.addLink
      })
    }, title)), (0, _react2.jsx)("div", {
      css: wrapper
    }, (0, _react2.jsx)(_Separator.default, null)), (0, _react2.jsx)(_Button.default, {
      target: "_blank",
      href: isValidUrl ? mediaLinkingState.link : undefined,
      disabled: !isValidUrl,
      onClick: onOpenLink,
      title: linkTitle,
      icon: (0, _react2.jsx)(_shortcut.default, {
        label: linkTitle
      }),
      className: "hyperlink-open-link"
    }), (0, _react2.jsx)(_Separator.default, null));
  } else {
    var _title = intl.formatMessage(_messages.linkToolbarMessages.addLink);

    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_Button.default, {
      testId: "add-link-button",
      onClick: onAddLink,
      title: _title,
      tooltipContent: (0, _react2.jsx)(_keymaps.ToolTipContent, {
        description: _title,
        keymap: _keymaps.addLink
      }),
      icon: (0, _react2.jsx)(_link.default, {
        label: _title
      })
    }), (0, _react2.jsx)(_Separator.default, null));
  }
};

exports.LinkToolbarAppearance = LinkToolbarAppearance;