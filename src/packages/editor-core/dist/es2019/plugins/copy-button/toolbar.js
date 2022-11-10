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
  const {
    state,
    formatMessage,
    onMouseEnter,
    onMouseLeave
  } = options;
  const copyButtonState = copyButtonPluginKey.getState(state);
  let buttonActionHandlers;

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

  return {
    id: 'editor.floatingToolbar.copy',
    type: 'button',
    appearance: 'subtle',
    icon: CopyIcon,
    title: formatMessage(copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied ? commonMessages.copiedToClipboard : commonMessages.copyToClipboard),
    ...buttonActionHandlers,
    hideTooltipOnClick: false,
    tabIndex: null // TODO select and delete styling needs to be removed when keyboard cursor moves away
    // problem already exist with delete as well

  };
}
export const showCopyButton = state => {
  return state && // Check if the Copy button plugin is enabled
  // @ts-ignore copyButtonPluginKey.key
  state.plugins.find(p => p.key === copyButtonPluginKey.key);
};
/**
 * Process floatingToolbar items for copyButton
 *
 * If copy button plugin not enabled, remove copy button item from toolbar items
 * else process copy button to standard floatingtoobarbutton
 */

export function processCopyButtonItems(state) {
  return items => items.flatMap(item => {
    switch (item.type) {
      case 'copy-button':
        if (item !== null && item !== void 0 && item.hidden || !showCopyButton(state)) {
          return [];
        }

        return item === null || item === void 0 ? void 0 : item.items.map(copyButtonItem => isSeparator(copyButtonItem) ? copyButtonItem : getCopyButtonConfig(copyButtonItem));

      default:
        return [item];
    }
  });
}