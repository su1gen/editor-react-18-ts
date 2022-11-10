import { mobileDimensionsPluginKey } from './plugin-factory';
export const getMobileDimensionsPluginState = state => {
  return mobileDimensionsPluginKey.getState(state);
};