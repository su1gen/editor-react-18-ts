"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCopyButtonConfig = getCopyButtonConfig;
exports.processCopyButtonItems = processCopyButtonItems;
exports.showCopyButton = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _copy = _interopRequireDefault(require("@atlaskit/icon/glyph/copy"));

var _messages = _interopRequireDefault(require("../../messages"));

var _decoration = require("../base/pm-plugins/decoration");

var _commands = require("./commands");

var _pluginKey = require("./pm-plugins/plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function isSeparator(item) {
  return (item === null || item === void 0 ? void 0 : item.type) === 'separator';
}

function isNodeOptions(options) {
  return 'nodeType' in options && options.nodeType !== undefined;
}

function getCopyButtonConfig(options) {
  var state = options.state,
      formatMessage = options.formatMessage,
      onMouseEnter = options.onMouseEnter,
      onMouseLeave = options.onMouseLeave;

  var copyButtonState = _pluginKey.copyButtonPluginKey.getState(state);

  var buttonActionHandlers;

  if (isNodeOptions(options)) {
    buttonActionHandlers = {
      onClick: (0, _commands.createToolbarCopyCommandForNode)(options.nodeType),
      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseEnter: onMouseEnter || (0, _decoration.hoverDecoration)(options.nodeType, true, 'ak-editor-selected-node'),
      onFocus: (0, _decoration.hoverDecoration)(options.nodeType, true, 'ak-editor-selected-node'),
      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseLeave: (0, _commands.resetCopiedState)(options.nodeType, onMouseLeave),
      onBlur: (0, _commands.resetCopiedState)(options.nodeType)
    };
  } else {
    buttonActionHandlers = {
      onClick: (0, _commands.createToolbarCopyCommandForMark)(options.markType),
      onMouseEnter: (0, _commands.getProvideMarkVisualFeedbackForCopyButtonCommand)(options.markType),
      onFocus: (0, _commands.getProvideMarkVisualFeedbackForCopyButtonCommand)(options.markType),
      onMouseLeave: _commands.removeMarkVisualFeedbackForCopyButtonCommand,
      onBlur: _commands.removeMarkVisualFeedbackForCopyButtonCommand
    };
  }

  return _objectSpread(_objectSpread({
    id: 'editor.floatingToolbar.copy',
    type: 'button',
    appearance: 'subtle',
    icon: _copy.default,
    title: formatMessage(copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied ? _messages.default.copiedToClipboard : _messages.default.copyToClipboard)
  }, buttonActionHandlers), {}, {
    hideTooltipOnClick: false,
    tabIndex: null // TODO select and delete styling needs to be removed when keyboard cursor moves away
    // problem already exist with delete as well

  });
}

var showCopyButton = function showCopyButton(state) {
  return state && // Check if the Copy button plugin is enabled
  // @ts-ignore copyButtonPluginKey.key
  state.plugins.find(function (p) {
    return p.key === _pluginKey.copyButtonPluginKey.key;
  });
};
/**
 * Process floatingToolbar items for copyButton
 *
 * If copy button plugin not enabled, remove copy button item from toolbar items
 * else process copy button to standard floatingtoobarbutton
 */


exports.showCopyButton = showCopyButton;

function processCopyButtonItems(state) {
  return function (items) {
    return items.flatMap(function (item) {
      switch (item.type) {
        case 'copy-button':
          if (item !== null && item !== void 0 && item.hidden || !showCopyButton(state)) {
            return [];
          }

          return item === null || item === void 0 ? void 0 : item.items.map(function (copyButtonItem) {
            return isSeparator(copyButtonItem) ? copyButtonItem : getCopyButtonConfig(copyButtonItem);
          });

        default:
          return [item];
      }
    });
  };
}