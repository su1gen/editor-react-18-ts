import { pluginKey as undoPluginKey } from './pm-plugins/plugin-key';
export const attachInputMeta = inputSource => command => (state, dispatch) => {
  let customTr = state.tr;

  const fakeDispatch = tr => {
    customTr = tr;
  };

  command(state, fakeDispatch);

  if (!customTr || !customTr.docChanged) {
    return false;
  }

  customTr.setMeta(undoPluginKey, inputSource);

  if (dispatch) {
    dispatch(customTr);
  }

  return true;
};