import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../../keymaps';
import { openMediaAltTextMenu, closeMediaAltTextMenu } from './commands';
export default function keymapPlugin(schema) {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.addAltText.common, openMediaAltTextMenu, list);
  keymaps.bindKeymapWithCommand(keymaps.escape.common, closeMediaAltTextMenu, list);
  return keymap(list);
}