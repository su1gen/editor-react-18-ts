import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export var updateListItem = function updateListItem(items) {
  return function (state, dispatch) {
    var tr = state.tr;
    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.UPDATE_LIST_ITEMS,
      params: {
        items: items
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};