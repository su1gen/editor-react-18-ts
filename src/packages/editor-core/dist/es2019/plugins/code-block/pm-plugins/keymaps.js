import { keymap } from 'prosemirror-keymap';
import { Selection } from 'prosemirror-state';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { getCursor, isEmptyNode, pipe } from '../../../utils';

const deleteCurrentItem = $from => tr => {
  return tr.delete($from.before($from.depth), $from.after($from.depth));
};

const setTextSelection = pos => tr => {
  const newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);

  if (newSelection) {
    tr.setSelection(newSelection);
  }

  return tr;
};

export function keymapPlugin(schema) {
  return keymap({
    Backspace: (state, dispatch) => {
      const $cursor = getCursor(state.selection);
      const {
        paragraph,
        codeBlock,
        listItem,
        table,
        layoutColumn
      } = state.schema.nodes;

      if (!$cursor || $cursor.parent.type !== codeBlock) {
        return false;
      }

      if ($cursor.pos === 1 || hasParentNodeOfType(listItem)(state.selection) && $cursor.parentOffset === 0) {
        const node = findParentNodeOfTypeClosestToPos($cursor, codeBlock);

        if (!node) {
          return false;
        }

        dispatch(state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, []).setBlockType($cursor.pos, $cursor.pos, paragraph));
        return true;
      }

      if ($cursor.node && isEmptyNode(schema)($cursor.node()) && (hasParentNodeOfType(layoutColumn)(state.selection) || hasParentNodeOfType(table)(state.selection))) {
        const {
          tr
        } = state;
        const insertPos = $cursor.pos;
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