import { keymap } from 'prosemirror-keymap';
import { Selection } from 'prosemirror-state';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { getCursor, isEmptyNode, pipe } from '../../../utils';

var deleteCurrentItem = function deleteCurrentItem($from) {
  return function (tr) {
    return tr.delete($from.before($from.depth), $from.after($from.depth));
  };
};

var setTextSelection = function setTextSelection(pos) {
  return function (tr) {
    var newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);

    if (newSelection) {
      tr.setSelection(newSelection);
    }

    return tr;
  };
};

export function keymapPlugin(schema) {
  return keymap({
    Backspace: function Backspace(state, dispatch) {
      var $cursor = getCursor(state.selection);
      var _state$schema$nodes = state.schema.nodes,
          paragraph = _state$schema$nodes.paragraph,
          codeBlock = _state$schema$nodes.codeBlock,
          listItem = _state$schema$nodes.listItem,
          table = _state$schema$nodes.table,
          layoutColumn = _state$schema$nodes.layoutColumn;

      if (!$cursor || $cursor.parent.type !== codeBlock) {
        return false;
      }

      if ($cursor.pos === 1 || hasParentNodeOfType(listItem)(state.selection) && $cursor.parentOffset === 0) {
        var node = findParentNodeOfTypeClosestToPos($cursor, codeBlock);

        if (!node) {
          return false;
        }

        dispatch(state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, []).setBlockType($cursor.pos, $cursor.pos, paragraph));
        return true;
      }

      if ($cursor.node && isEmptyNode(schema)($cursor.node()) && (hasParentNodeOfType(layoutColumn)(state.selection) || hasParentNodeOfType(table)(state.selection))) {
        var tr = state.tr;
        var insertPos = $cursor.pos;
        dispatch(pipe(deleteCurrentItem($cursor), setTextSelection(insertPos))(tr).scrollIntoView());
        return true;
      } // Handle not nested empty code block


      if (isEmptyNode(schema)($cursor.node())) {
        dispatch(deleteCurrentItem($cursor)(state === null || state === void 0 ? void 0 : state.tr));
        return true;
      }

      return false;
    }
  });
}
export default keymapPlugin;