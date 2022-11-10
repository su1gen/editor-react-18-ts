import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export const updateListItem = items => {
  return (state, dispatch) => {
    const tr = state.tr;
    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.UPDATE_LIST_ITEMS,
      params: {
        items
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};