import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../../keymaps';
import { showLinkingToolbarWithMediaTypeCheck } from '../../commands/linking';
export default function keymapPlugin(schema) {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.addLink.common, showLinkingToolbarWithMediaTypeCheck, list);
  return keymap(list);
}