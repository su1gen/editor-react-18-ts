import { keymap } from 'prosemirror-keymap';
import { NodeSelection } from 'prosemirror-state';
import { closeDatePicker, openDatePicker, focusDateInput } from '../actions';
import * as keymaps from '../../../keymaps';
import { getPluginState } from './main';
export function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.enter.common, function (state, dispatch) {
    var datePlugin = getPluginState(state);
    var isDateNode = state.selection instanceof NodeSelection ? state.selection.node.type === state.schema.nodes.date : false;

    if (!isDateNode) {
      return false;
    }

    if (!datePlugin.showDatePickerAt) {
      openDatePicker()(state, dispatch);
      return true;
    }

    closeDatePicker()(state, dispatch);
    return true;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, function (state, dispatch) {
    var datePlugin = getPluginState(state);
    var isDateNode = state.selection instanceof NodeSelection ? state.selection.node.type === state.schema.nodes.date : false;

    if (!isDateNode) {
      return false;
    }

    if (datePlugin.showDatePickerAt) {
      focusDateInput()(state, dispatch);
      return true;
    }

    return false;
  }, list);
  return keymap(list);
}
export default keymapPlugin;