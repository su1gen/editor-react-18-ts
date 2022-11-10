import { toggleMark } from '../../../utils/commands';
import { ACTIONS, pluginKey } from '../pm-plugins/main';
import { getDisabledState } from '../utils/disabled';
export var toggleColor = function toggleColor(color) {
  return function (state, dispatch) {
    var textColor = state.schema.marks.textColor;
    var tr = state.tr;
    var disabledState = getDisabledState(state);

    if (disabledState) {
      if (dispatch) {
        dispatch(tr.setMeta(pluginKey, {
          action: ACTIONS.DISABLE
        }));
      }

      return false;
    }

    if (dispatch) {
      state.tr.setMeta(pluginKey, {
        action: ACTIONS.SET_COLOR,
        color: color
      });
      state.tr.scrollIntoView();
      toggleMark(textColor, {
        color: color
      })(state, dispatch);
    }

    return true;
  };
};