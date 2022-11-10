import { createHorizontalRule } from './pm-plugins/input-rule';
export var insertHorizontalRule = function insertHorizontalRule(inputMethod) {
  return function (state, dispatch) {
    var tr = createHorizontalRule(state, state.selection.from, state.selection.to, inputMethod);

    if (tr) {
      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};