import { redo, undo } from 'prosemirror-history';
import * as keymaps from '../../../keymaps';
import * as commands from '../../../commands';
import * as blockTypes from '../types';
import { keymap } from '../../../utils/keymap';
import { cleanUpAtTheStartOfDocument, insertBlockTypesWithAnalytics } from '../commands';
import { deleteEmptyParagraphAndMoveBlockUp } from '../../../utils/commands';
import { INPUT_METHOD } from '../../analytics';
import { isNodeAWrappingBlockNode } from '../utils';
export default function keymapPlugin(schema, featureFlags) {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, commands.insertNewLineWithAnalytics, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, commands.createNewParagraphAbove, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, commands.createNewParagraphBelow, list);
  keymaps.bindKeymapWithCommand(keymaps.findKeyMapForBrowser(keymaps.redo), redo, list);
  keymaps.bindKeymapWithCommand(keymaps.undo.common, undo, list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, cleanUpAtTheStartOfDocument, list);
  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common, deleteEmptyParagraphAndMoveBlockUp(isNodeAWrappingBlockNode), list);
  keymaps.bindKeymapWithCommand(keymaps.forwardDelete.mac, deleteEmptyParagraphAndMoveBlockUp(isNodeAWrappingBlockNode), list);

  if (schema.nodes[blockTypes.BLOCK_QUOTE.nodeName]) {
    keymaps.bindKeymapWithCommand(keymaps.findShortcutByKeymap(keymaps.toggleBlockQuote), insertBlockTypesWithAnalytics(blockTypes.BLOCK_QUOTE.name, INPUT_METHOD.KEYBOARD), list);
  }

  return keymap(list);
}