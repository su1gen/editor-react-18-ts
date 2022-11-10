import { keymap } from 'prosemirror-keymap';
import { bindKeymapWithCommand, moveRight, moveLeft } from '../../../keymaps';
import { arrowRight, arrowLeft } from '../commands';

function keymapPlugin() {
  var list = {};
  bindKeymapWithCommand(moveRight.common, arrowRight, list);
  bindKeymapWithCommand(moveLeft.common, arrowLeft, list);
  return keymap(list);
}

export default keymapPlugin;