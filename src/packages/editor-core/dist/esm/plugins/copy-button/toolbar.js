import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import CopyIcon from '@atlaskit/icon/glyph/copy';
import commonMessages from '../../messages';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { createToolbarCopyCommandForNode, createToolbarCopyCommandForMark, resetCopiedState, getProvideMarkVisualFeedbackForCopyButtonCommand, removeMarkVisualFeedbackForCopyButtonCommand } from './commands';
import { copyButtonPluginKey } from './pm-plugins/plugin-key';

function isSeparator(item) {
  return (item === null || item === void 0 ? void 0 : item.type) === 'separator';
}

function isNodeOptions(options) {
  return 'nodeType' in options && options.nodeType !== undefined;
}

export function getCopyButtonConfig(options) {
  var state = options.state,
      formatMessage = options.formatMessage,
      onMouseEnter = options.onMouseEnter,
      onMouseLeave = options.onMouseLeave;
  var copyButtonState = copyButtonPluginKey.getState(state);
  var buttonActionHandlers;

  if (isNodeOptions(options)) {
    buttonActionHandlers = {
      onClick: createToolbarCopyCommandForNode(options.nodeType),
      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseEnter: onMouseEnter || hoverDecoration(options.nodeType, true, 'ak-editor-selected-node'),
      onFocus: hoverDecoration(options.nodeType, true, 'ak-editor-selected-node'),
      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseLeave: resetCopiedState(options.nodeType, onMouseLeave),
      onBlur: resetCopiedState(options.nodeType)
    };
  } else {
    buttonActionHandlers = {
      onClick: createToolbarCopyCommandForMark(options.markType),
      onMouseEnter: getProvideMarkVisualFeedbackForCopyButtonCommand(options.markType),
      onFocus: getProvideMarkVisualFeedbackForCopyButtonCommand(options.markType),
      onMouseLeave: removeMarkVisualFeedbackForCopyButtonCommand,
      onBlur: removeMarkVisualFeedbackForCopyButtonCommand
    };
  }

  return _objectSpread(_objectSpread({
    id: 'editor.floatingToolbar.copy',
    type: 'button',
    appearance: 'subtle',
    icon: CopyIcon,
    title: formatMessage(copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied ? commonMessages.copiedToClipboard : commonMessages.copyToClipboard)
  }, buttonActionHandlers), {}, {
    hideTooltipOnClick: false,
    tabIndex: null // TODO select and delete styling needs to be removed when keyboard cursor moves away
    // problem already exist with delete as well

  });
}
export var showCopyButton = function showCopyButton(state) {
  return state && // Check if the Copy button plugin is enabled
  // @ts-ignore copyButtonPluginKey.key
  state.plugins.find(function (p) {
    return p.key === copyButtonPluginKey.key;
  });
};
/**
 * Process floatingToolbar items for copyButton
 *
 * If copy button plugin not enabled, remove copy button item from toolbar items
 * else process copy button to standard floatingtoobarbutton
 */

export function processCopyButtonItems(state) {
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