import { pluginKey } from './plugin-key';
export var openHelpCommand = function openHelpCommand(tr, dispatch) {
  tr = tr.setMeta(pluginKey, true);

  if (dispatch) {
    dispatch(tr);
    return true;
  }

  return false;
};
export var closeHelpCommand = function closeHelpCommand(tr, dispatch) {
  tr = tr.setMeta(pluginKey, false);
  dispatch(tr);
};
export var stopPropagationCommand = function stopPropagationCommand(e) {
  return e.stopPropagation();
};