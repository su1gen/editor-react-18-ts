import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export var updateSelectedIndex = function updateSelectedIndex(selectedIndex) {
  return function (state, dispatch) {
    var pluginState = typeAheadPluginKey.getState(state);

    if (pluginState.selectedIndex === selectedIndex) {
      return false;
    }

    var tr = state.tr;
    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.UPDATE_SELECTED_INDEX,
      params: {
        selectedIndex: selectedIndex
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};