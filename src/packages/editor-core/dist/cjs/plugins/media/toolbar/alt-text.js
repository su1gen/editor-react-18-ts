"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAltTextToolbar = exports.altTextEditComponent = exports.altTextButton = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _commands = require("../pm-plugins/alt-text/commands");

var _keymaps = require("../../../keymaps");

var _messages = require("../pm-plugins/alt-text/messages");

var _AltTextEdit = _interopRequireWildcard(require("../pm-plugins/alt-text/ui/AltTextEdit"));

var _mediaCommon = require("../utils/media-common");

var _style = require("../pm-plugins/alt-text/style");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var altTextButton = function altTextButton(intl, state) {
  var mediaNode = (0, _mediaCommon.getMediaNodeFromSelection)(state);
  var message = mediaNode && mediaNode.attrs.alt ? _messages.messages.editAltText : _messages.messages.altText;
  var title = intl.formatMessage(message);
  return {
    title: title,
    id: 'editor.media.altText',
    type: 'button',
    onClick: _commands.openMediaAltTextMenu,
    showTitle: true,
    testId: 'alt-text-edit-button',
    tooltipContent: /*#__PURE__*/_react.default.createElement(_keymaps.ToolTipContent, {
      description: title,
      keymap: _keymaps.addAltText
    })
  };
};

exports.altTextButton = altTextButton;

var altTextEditComponent = function altTextEditComponent(options) {
  return {
    type: 'custom',
    fallback: [],
    render: function render(view, idx) {
      if (!view) {
        return null;
      }

      var mediaNode = (0, _mediaCommon.getMediaNodeFromSelection)(view.state);

      if (!mediaNode) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_AltTextEdit.default, {
        view: view,
        key: idx,
        value: mediaNode.attrs.alt,
        altTextValidator: options && options.altTextValidator
      });
    }
  };
};

exports.altTextEditComponent = altTextEditComponent;

var getAltTextToolbar = function getAltTextToolbar(toolbarBaseConfig, options) {
  return _objectSpread(_objectSpread({}, toolbarBaseConfig), {}, {
    width: _AltTextEdit.CONTAINER_WIDTH_IN_PX,
    className: _style.ClassNames.FLOATING_TOOLBAR_COMPONENT,
    items: [altTextEditComponent(options)]
  });
};

exports.getAltTextToolbar = getAltTextToolbar;