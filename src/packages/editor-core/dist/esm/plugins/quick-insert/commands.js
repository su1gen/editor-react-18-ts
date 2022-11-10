// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { insertSelectedItem } from '../../utils/insert';
import { pluginKey } from './plugin-key';
export var openElementBrowserModal = function openElementBrowserModal() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(pluginKey, {
        isElementBrowserModalOpen: true
      }));
    }

    return true;
  };
};
export var closeElementBrowserModal = function closeElementBrowserModal() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(pluginKey, {
        isElementBrowserModalOpen: false
      }));
    }

    return true;
  };
}; // this method was adapted from the typeahed plugin so we respect the API for quick insert items

export var insertItem = function insertItem(item) {
  return function (state, dispatch) {
    var insert = function insert(maybeNode) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return insertSelectedItem(maybeNode, opts)(state, state.tr, state.selection.head);
    };

    var tr = item.action(insert, state);

    if (tr && dispatch) {
      dispatch(tr);
    }

    return true;
  };
};