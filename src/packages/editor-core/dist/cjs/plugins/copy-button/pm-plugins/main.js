"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyButtonPlugin = copyButtonPlugin;
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorView = require("prosemirror-view");

var _pluginKey = require("./plugin-key");

function getMarkSelectionDecorationStartAndEnd(_ref) {
  var markType = _ref.markType,
      transaction = _ref.transaction;
  var headHesolvedPos = transaction.selection.$head;
  var textNodeIndex = transaction.selection.$head.index();
  var textNode = headHesolvedPos.parent.maybeChild(textNodeIndex);
  var textNodeOffset = 0;
  headHesolvedPos.parent.forEach(function (_node, nodeOffset, index) {
    if (index === textNodeIndex) {
      textNodeOffset = nodeOffset;
    }
  });
  var start = headHesolvedPos.start(headHesolvedPos.depth) + textNodeOffset;
  var end = start + textNode.text.length;
  return {
    start: start,
    end: end,
    markType: markType
  };
}

function copyButtonPlugin() {
  return new _safePlugin.SafePlugin({
    key: _pluginKey.copyButtonPluginKey,
    state: {
      init: function init() {
        return {
          copied: false,
          markSelection: undefined
        };
      },
      apply: function apply(tr, currentPluginState) {
        var meta = tr.getMeta(_pluginKey.copyButtonPluginKey);

        if ((meta === null || meta === void 0 ? void 0 : meta.copied) !== undefined) {
          return {
            copied: meta.copied,
            markSelection: undefined
          };
        }

        if (meta !== null && meta !== void 0 && meta.showSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: getMarkSelectionDecorationStartAndEnd({
              markType: meta.markType,
              transaction: tr
            })
          };
        }

        if (meta !== null && meta !== void 0 && meta.removeSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: undefined
          };
        }

        if (currentPluginState.markSelection) {
          return {
            copied: currentPluginState.copied,
            markSelection: getMarkSelectionDecorationStartAndEnd({
              markType: currentPluginState.markSelection.markType,
              transaction: tr
            })
          };
        }

        return currentPluginState;
      }
    },
    props: {
      decorations: function decorations(_state) {
        // Showing visual hints for the hyperlink copy button has been disabled
        // due to an issue where invalid hyperlink marks cause the floating toolbar
        // to jump around when the copy button is hovered.
        // See the following bug for details -- once that is resolved -- the visual
        // hints can be re enabled.
        // https://product-fabric.atlassian.net/browse/DTR-722
        // const copyButtonPluginState = copyButtonPluginKey.getState(
        //   state,
        // ) as CopyButtonPluginState;
        // if (copyButtonPluginState.markSelection) {
        //   const { start, end } = copyButtonPluginState.markSelection;
        //   return DecorationSet.create(state.doc, [
        //     Decoration.inline(start, end, {
        //       class: 'ProseMirror-fake-text-selection',
        //     }),
        //   ]);
        // }
        return _prosemirrorView.DecorationSet.empty;
      }
    }
  });
}

var _default = copyButtonPlugin;
exports.default = _default;