import { createHorizontalRule } from './pm-plugins/input-rule';
export const insertHorizontalRule = inputMethod => (state, dispatch) => {
  const tr = createHorizontalRule(state, state.selection.from, state.selection.to, inputMethod);

  if (tr) {
    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return false;
};