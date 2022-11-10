import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../keymaps';
import { INPUT_METHOD } from '../../analytics';
import { insertHorizontalRule } from '../commands';
export function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.insertRule.common, insertHorizontalRule(INPUT_METHOD.SHORTCUT), list);
  keymaps.bindKeymapWithCommand(keymaps.escape.common, function () {
    return true;
  }, list);
  return keymap(list);
}
export default keymapPlugin;