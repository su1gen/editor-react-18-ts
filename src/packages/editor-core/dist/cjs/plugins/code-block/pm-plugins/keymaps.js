"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../../../utils");

var deleteCurrentItem = function deleteCurrentItem($from) {
  return function (tr) {
    return tr.delete($from.before($from.depth), $from.after($from.depth));
  };
};

var setTextSelection = function setTextSelection(pos) {
  return function (tr) {
    var newSelection = _prosemirrorState.Selection.findFrom(tr.doc.resolve(pos), -1, true);

    if (newSelection) {
      tr.setSelection(newSelection);
    }

    return tr;
  };
};

function keymapPlugin(schema) {
  return (0, _prosemirrorKeymap.keymap)({
    Backspace: function Backspace(state, dispatch) {
      var $cursor = (0, _utils.getCursor)(state.selection);
      var _state$schema$nodes = state.schema.nodes,
          paragraph = _state$schema$nodes.paragraph,
          codeBlock = _state$schema$nodes.codeBlock,
          listItem = _state$schema$nodes.listItem,
          table = _state$schema$nodes.table,
          layoutColumn = _state$schema$nodes.layoutColumn;

      if (!$cursor || $cursor.parent.type !== codeBlock) {
        return false;
      }

      if ($cursor.pos === 1 || (0, _prosemirrorUtils.hasParentNodeOfType)(listItem)(state.selection) && $cursor.parentOffset === 0) {
        var node = (0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($cursor, codeBlock);

        if (!node) {
          return false;
        }

        dispatch(state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, []).setBlockType($cursor.pos, $cursor.pos, paragraph));
        return true;
      }

      if ($cursor.node && (0, _utils.isEmptyNode)(schema)($cursor.node()) && ((0, _prosemirrorUtils.hasParentNodeOfType)(layoutColumn)(state.selection) || (0, _prosemirrorUtils.hasParentNodeOfType)(table)(state.selection))) {
        var tr = state.tr;
        var insertPos = $cursor.pos;
        dispatch((0, _utils.pipe)(deleteCurrentItem($cursor), setTextSelection(insertPos))(tr).scrollIntoView());
        return true;
      } // Handle not nested empty code block


      if ((0, _utils.isEmptyNode)(schema)($cursor.node())) {
        dispatch(deleteCurrentItem($cursor)(state === null || state === void 0 ? void 0 : state.tr));
        return true;
      }

      return false;
    }
  });
}

var _default = keymapPlugin;
exports.default = _default;