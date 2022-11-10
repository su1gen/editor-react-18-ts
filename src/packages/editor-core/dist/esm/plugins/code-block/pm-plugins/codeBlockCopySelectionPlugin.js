import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getSelectedNodeOrNodeParentByNodeType } from '../../copy-button/utils';
export var copySelectionPluginKey = new PluginKey('codeBlockCopySelectionPlugin');

function getSelectionDecorationStartAndEnd(_ref) {
  var state = _ref.state,
      transaction = _ref.transaction;
  var codeBlockNode = getSelectedNodeOrNodeParentByNodeType({
    nodeType: state.schema.nodes.codeBlock,
    selection: transaction.selection
  });

  if (!codeBlockNode) {
    return {
      decorationStartAndEnd: undefined
    };
  }

  var decorationStartAndEnd = [codeBlockNode.start, codeBlockNode.start + codeBlockNode.node.nodeSize];
  return {
    decorationStartAndEnd: decorationStartAndEnd
  };
}

export function codeBlockCopySelectionPlugin() {
  return new SafePlugin({
    key: copySelectionPluginKey,
    state: {
      init: function init() {
        return {
          decorationStartAndEnd: undefined
        };
      },
      apply: function apply(transaction, currentCodeBlockCopySelectionPluginState, _oldState, newState) {
        switch (transaction.getMeta(copySelectionPluginKey)) {
          case 'show-selection':
            {
              return getSelectionDecorationStartAndEnd({
                state: newState,
                transaction: transaction
              });
            }

          case 'remove-selection':
            return {
              decorationStartAndEnd: undefined
            };

          default:
            // The contents of the code block can change while the selection is being shown
            // (either from collab edits -- or from the user continuing to type while hovering
            // the mouse over the copy button).
            // This ensures the selection is updated in these cases.
            if (currentCodeBlockCopySelectionPluginState.decorationStartAndEnd !== undefined) {
              return getSelectionDecorationStartAndEnd({
                state: newState,
                transaction: transaction
              });
            }

            return currentCodeBlockCopySelectionPluginState;
        }
      }
    },
    props: {
      decorations: function decorations(state) {
        if (copySelectionPluginKey.getState(state).decorationStartAndEnd) {
          var _copySelectionPluginK = _slicedToArray(copySelectionPluginKey.getState(state).decorationStartAndEnd, 2),
              _start = _copySelectionPluginK[0],
              _end = _copySelectionPluginK[1];

          return DecorationSet.create(state.doc, [Decoration.inline(_start, _end, {
            class: 'ProseMirror-fake-text-selection'
          })]);
        }

        return DecorationSet.empty;
      }
    }
  });
}
export function provideVisualFeedbackForCopyButton(state, dispatch) {
  var tr = state.tr;
  tr.setMeta(copySelectionPluginKey, 'show-selection'); // note: dispatch should always be defined when called from the
  // floating toolbar. Howver the Command type which the floating toolbar
  // uses suggests it's optional.
  // Using the type here to protect against future refactors of the
  // floating toolbar

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}
export function removeVisualFeedbackForCopyButton(state, dispatch) {
  var tr = state.tr;
  tr.setMeta(copySelectionPluginKey, 'remove-selection'); // note: dispatch should always be defined when called from the
  // floating toolbar. Howver the Command type which the floating toolbar
  // uses suggests it's optional.
  // Using the type here to protect against future refactors of the
  // floating toolbar

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}