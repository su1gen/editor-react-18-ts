import { keymap } from 'prosemirror-keymap';
import { getPluginState } from './main';
import * as keymaps from '../../../keymaps';
import { clearEditingContext } from '../commands';
export default function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.escape.common, function (state, dispatch) {
    var extensionState = getPluginState(state);

    if (!extensionState.showContextPanel) {
      return false;
    }

    return clearEditingContext(state, dispatch);
  }, list);
  return keymap(list);
}