import { safeInsert } from 'prosemirror-utils';
import { createExternalMediaNode } from '../utils';
import { startUpload } from './actions';
import { stateKey } from './plugin-key';
export var insertExternalImage = function insertExternalImage(options) {
  return function (state, dispatch) {
    var pluginState = stateKey.getState(state);

    if (!pluginState.enabled || !options.src) {
      return false;
    }

    var mediaNode = createExternalMediaNode(options.src, state.schema);

    if (!mediaNode) {
      return false;
    }

    if (dispatch) {
      dispatch(safeInsert(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView());
    }

    return true;
  };
};
export var startImageUpload = function startImageUpload(event) {
  return function (state, dispatch) {
    var pluginState = stateKey.getState(state);

    if (!pluginState.enabled) {
      return false;
    }

    if (dispatch) {
      dispatch(startUpload(event)(state.tr));
    }

    return true;
  };
};