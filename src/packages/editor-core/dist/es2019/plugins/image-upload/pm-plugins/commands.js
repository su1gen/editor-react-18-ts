import { safeInsert } from 'prosemirror-utils';
import { createExternalMediaNode } from '../utils';
import { startUpload } from './actions';
import { stateKey } from './plugin-key';
export const insertExternalImage = options => (state, dispatch) => {
  const pluginState = stateKey.getState(state);

  if (!pluginState.enabled || !options.src) {
    return false;
  }

  const mediaNode = createExternalMediaNode(options.src, state.schema);

  if (!mediaNode) {
    return false;
  }

  if (dispatch) {
    dispatch(safeInsert(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView());
  }

  return true;
};
export const startImageUpload = event => (state, dispatch) => {
  const pluginState = stateKey.getState(state);

  if (!pluginState.enabled) {
    return false;
  }

  if (dispatch) {
    dispatch(startUpload(event)(state.tr));
  }

  return true;
};