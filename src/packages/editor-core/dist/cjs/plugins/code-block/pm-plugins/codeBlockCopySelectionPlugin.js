"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeBlockCopySelectionPlugin = codeBlockCopySelectionPlugin;
exports.copySelectionPluginKey = void 0;
exports.provideVisualFeedbackForCopyButton = provideVisualFeedbackForCopyButton;
exports.removeVisualFeedbackForCopyButton = removeVisualFeedbackForCopyButton;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _utils = require("../../copy-button/utils");

var copySelectionPluginKey = new _prosemirrorState.PluginKey('codeBlockCopySelectionPlugin');
exports.copySelectionPluginKey = copySelectionPluginKey;

function getSelectionDecorationStartAndEnd(_ref) {
  var state = _ref.state,
      transaction = _ref.transaction;
  var codeBlockNode = (0, _utils.getSelectedNodeOrNodeParentByNodeType)({
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

function codeBlockCopySelectionPlugin() {
  return new _safePlugin.SafePlugin({
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
          var _copySelectionPluginK = (0, _slicedToArray2.default)(copySelectionPluginKey.getState(state).decorationStartAndEnd, 2),
              _start = _copySelectionPluginK[0],
              _end = _copySelectionPluginK[1];

          return _prosemirrorView.DecorationSet.create(state.doc, [_prosemirrorView.Decoration.inline(_start, _end, {
            class: 'ProseMirror-fake-text-selection'
          })]);
        }

        return _prosemirrorView.DecorationSet.empty;
      }
    }
  });
}

function provideVisualFeedbackForCopyButton(state, dispatch) {
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

function removeVisualFeedbackForCopyButton(state, dispatch) {
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