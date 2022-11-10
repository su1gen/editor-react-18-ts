import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export var updateQuery = function updateQuery(query) {
  return function (state, dispatch) {
    var pluginState = typeAheadPluginKey.getState(state);

    if (pluginState.query === query) {
      return false;
    }

    var tr = state.tr;
    tr.setMeta(typeAheadPluginKey, {
      action: ACTIONS.CHANGE_QUERY,
      params: {
        query: query
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};