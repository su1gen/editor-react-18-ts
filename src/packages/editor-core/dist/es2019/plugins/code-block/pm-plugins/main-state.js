import { pluginKey } from '../plugin-key';
export const getPluginState = state => pluginKey.getState(state);
export const setPluginState = stateProps => (state, dispatch) => {
  const pluginState = getPluginState(state);
  dispatch(state.tr.setMeta(pluginKey, { ...pluginState,
    ...stateProps
  }));
  return true;
};