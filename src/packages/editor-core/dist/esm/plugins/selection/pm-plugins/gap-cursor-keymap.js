import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../keymaps';
import { arrow, deleteNode } from '../gap-cursor/actions';
import { Direction } from '../gap-cursor/direction';
import { GapCursorSelection } from '../gap-cursor/selection';
import { createParagraphNear } from 'prosemirror-commands';
export default function keymapPlugin() {
  var map = {};
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, function (state, dispatch, view) {
    var isInGapCursor = state.selection instanceof GapCursorSelection; // Only operate in gap cursor

    if (!isInGapCursor) {
      return false;
    }

    return createParagraphNear(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return arrow(Direction.LEFT, endOfTextblock)(state, dispatch, view);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveRight.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return arrow(Direction.RIGHT, endOfTextblock)(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return arrow(Direction.UP, endOfTextblock)(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return arrow(Direction.DOWN, endOfTextblock)(state, dispatch);
  }, map); // default PM's Backspace doesn't handle removing block nodes when cursor is after it

  keymaps.bindKeymapWithCommand(keymaps.backspace.common, deleteNode(Direction.BACKWARD), map); // handle Delete key (remove node after the cursor)

  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common, deleteNode(Direction.FORWARD), map);
  return keymap(map);
}